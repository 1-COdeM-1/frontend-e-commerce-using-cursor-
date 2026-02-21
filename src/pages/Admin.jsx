import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { getSalesByProduct, clearOrders, getSalesHistoryByProduct } from '../data/orders'
import styles from './Admin.module.css'

function formatSaleDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)

  // Older browsers/environments may not support dateStyle/timeStyle or
  // even the `hour`/`minute` options on toLocaleString. Wrap in try/catch
  // and fall back to a simple manual formatting if it fails.
  try {
    return d.toLocaleString(undefined, { dateStyle: 'medium', hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    // Fallback: use basic locale functions and append time
    const datePart = d.toLocaleDateString()
    const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${datePart} ${timePart}`
  }
}

export default function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: '', image: '' })
  const [addForm, setAddForm] = useState({ name: '', price: '', image: '', category: 'tees', description: '' })
  const [addSuccess, setAddSuccess] = useState(false)
  const [imageError, setImageError] = useState('')
  const [chartData, setChartData] = useState([])
  const [salesHistory, setSalesHistory] = useState({})

  const isAdmin = user?.email === 'admin@admin.com' || user?.isAdmin
  const MAX_IMAGE_SIZE = 800 * 1024

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      if (file.size > MAX_IMAGE_SIZE) reject(new Error('Image must be smaller than 800 KB.'))
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const handleAddImageChange = async (e) => {
    setImageError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError('Please choose an image file.'); return }
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setAddForm((f) => ({ ...f, image: dataUrl }))
    } catch (err) {
      setImageError(err.message || 'Failed to load image.')
    }
    e.target.value = ''
  }

  const handleEditImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setEditForm((f) => ({ ...f, image: dataUrl }))
    } catch (err) {
      setImageError(err.message || 'Failed to load image.')
    }
    e.target.value = ''
  }

  useEffect(() => {
    if (!user) navigate('/login?redirect=/admin', { replace: true })
    else if (!isAdmin) navigate('/', { replace: true })
  }, [user, isAdmin, navigate])

  const handleStartEdit = (p) => {
    setEditingId(p.id)
    setEditForm({ name: p.name, price: String(p.price), image: p.image })
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    updateProduct(editingId, { name: editForm.name.trim(), price: Number(editForm.price) || 0, image: editForm.image })
    setEditingId(null)
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    setImageError('')
    if (!addForm.name.trim() || !addForm.image) { if (!addForm.image) setImageError('Please upload a product image.'); return }
    addProduct({ name: addForm.name.trim(), price: Number(addForm.price) || 0, image: addForm.image, category: addForm.category, description: addForm.description.trim() })
    setAddForm({ name: '', price: '', image: '', category: 'tees', description: '' })
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 3000)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) deleteProduct(id)
  }

  // Build chart from current localStorage data
  function buildChartData(productList) {
    const salesByProduct = getSalesByProduct()
    const values = Object.values(salesByProduct)
    const maxSold = values.length > 0 ? Math.max(...values) : 0
    return productList.map((p) => ({
      id: p.id,
      name: p.name,
      sold: salesByProduct[p.id] || 0,
      heightPercent: maxSold > 0 ? ((salesByProduct[p.id] || 0) / maxSold) * 100 : 0,
    }))
  }

  // Re-build chart whenever products change
  useEffect(() => {
    setChartData(buildChartData(products))
    setSalesHistory(getSalesHistoryByProduct())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const handleClearSales = () => {
    if (!window.confirm('Clear all sales data? The graph will reset to zero. This cannot be undone.')) return
    // 1. Wipe localStorage
    clearOrders()
    // 2. Immediately zero out every bar — no re-read needed
    setChartData(products.map((p) => ({ id: p.id, name: p.name, sold: 0, heightPercent: 0 })))
    setSalesHistory({})
  }

  if (!user || !isAdmin) return null

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h1 className={styles.title}>Admin — Products</h1>
          <Link to="/" className={styles.backLink}>← Back to store</Link>
        </div>

        <section className={styles.section}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Sales by product</h2>
              <p className={styles.chartSub}>Number of units sold per product (from completed orders)</p>
            </div>
            <button type="button" onClick={handleClearSales} className={styles.clearSalesBtn}>Clear all sales data</button>
          </div>
          <div className={styles.chartWrap}>
            <div className={styles.chartYAxis}>
              <span className={styles.yLabel}>Units sold</span>
              <div className={styles.yTicks}>
                {(() => {
                  const allSold = chartData.map((d) => d.sold)
                  const max = allSold.length > 0 && Math.max(...allSold) > 0 ? Math.max(...allSold) : 0
                  const ticks = max > 0 ? [max, Math.ceil(max * 0.66), Math.ceil(max * 0.33), 0] : [0, 0, 0, 0]
                  return ticks.map((t, i) => <span key={i} className={styles.yTick}>{t}</span>)
                })()}
              </div>
            </div>
            <div className={styles.chartArea}>
              <div className={styles.bars}>
                {chartData.map((d) => {
                  const history = salesHistory[d.id] || []
                  const titleText = history.length ? `${d.name}: ${d.sold} sold\nSold on: ${history.map((h) => `${formatSaleDate(h.date)} (${h.quantity})`).join('\n')}` : `${d.name}: ${d.sold} sold`
                  return (
                    <div key={d.id} className={styles.barCell}>
                      <div className={styles.bar} style={{ height: `${d.heightPercent}%` }} title={titleText}>
                        {d.sold > 0 && <span className={styles.barLabel}>{d.sold}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className={styles.chartXAxis}>
                {chartData.map((d) => (
                  <span key={d.id} className={styles.xLabel} title={d.name}>{d.name.length > 12 ? d.name.slice(0, 10) + '…' : d.name}</span>
                ))}
              </div>
            </div>
          </div>
          {chartData.some((d) => d.sold > 0) && (
            <div className={styles.salesHistorySection}>
              <h3 className={styles.salesHistoryTitle}>When each product sold</h3>
              <ul className={styles.salesHistoryList}>
                {chartData.filter((d) => d.sold > 0).map((d) => (
                  <li key={d.id} className={styles.salesHistoryItem}>
                    <span className={styles.salesHistoryName}>{d.name}</span>
                    <span className={styles.salesHistoryTotal}>{d.sold} sold</span>
                    <ul className={styles.salesHistoryDates}>
                      {(salesHistory[d.id] || []).map((h, i) => (
                        <li key={i}>{formatSaleDate(h.date)} — {h.quantity} {h.quantity === 1 ? 'unit' : 'units'}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Add new product</h2>
          <form onSubmit={handleAddProduct} className={styles.addForm}>
            <div className={styles.addGrid}>
              <label className={styles.label}>Name<input type="text" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} required className={styles.input} placeholder="Product name" /></label>
              <label className={styles.label}>Price ($)<input type="number" min="0" step="0.01" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} className={styles.input} placeholder="0" /></label>
              <label className={styles.label}>Product image
                <input type="file" accept="image/*" onChange={handleAddImageChange} className={styles.fileInput} />
                {addForm.image ? <div className={styles.previewWrap}><img src={addForm.image} alt="Preview" className={styles.previewImg} /><span className={styles.previewLabel}>Image selected</span></div> : <span className={styles.fileHint}>Choose an image (max 800 KB)</span>}
                {imageError && <span className={styles.fieldError}>{imageError}</span>}
              </label>
              <label className={styles.label}>Category<select value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))} className={styles.input}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            </div>
            <label className={styles.label}>Description (optional)<textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} className={styles.textarea} placeholder="Short description" rows={2} /></label>
            <div className={styles.addActions}>
              <button type="submit" className={styles.addBtn}>Add product</button>
              {addSuccess && <span className={styles.successMsg}>Product added to the store.</span>}
            </div>
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All products ({products.length})</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Photo</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {editingId === p.id ? (
                        <div className={styles.editImageCell}>
                          <img src={editForm.image} alt="" className={styles.thumb} />
                          <label className={styles.uploadLabel}><input type="file" accept="image/*" onChange={handleEditImageChange} className={styles.fileInputHidden} />Upload new</label>
                        </div>
                      ) : (
                        <img src={p.image} alt="" className={styles.thumb} />
                      )}
                    </td>
                    <td>
                      {editingId === p.id ? <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className={styles.inputSmall} /> : p.name}
                    </td>
                    <td>
                      {editingId === p.id ? <input type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))} className={styles.inputSmall} /> : `$${p.price}`}
                    </td>
                    <td>{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                    <td>
                      {editingId === p.id ? (
                        <span className={styles.inlineActions}><button type="button" onClick={handleSaveEdit} className={styles.saveBtn}>Save</button><button type="button" onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button></span>
                      ) : (
                        <span className={styles.inlineActions}><button type="button" onClick={() => handleStartEdit(p)} className={styles.editBtn}>Edit</button><button type="button" onClick={() => handleDelete(p.id, p.name)} className={styles.deleteBtn}>Delete</button></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
