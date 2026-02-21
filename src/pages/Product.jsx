import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductBySlug } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import styles from './Product.module.css'

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const product = getProductBySlug(products, slug)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [size, setSize] = useState(product?.sizes?.[0] || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <p className={styles.notFound}>Product not found.</p>
          <button onClick={() => navigate('/shop')} className={styles.backBtn}>Back to shop</button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}`, { replace: false })
      return
    }
    addToCart({ productId: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price, size, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
        <div className={styles.grid}>
          <div className={styles.gallery}>
            <img src={product.image} alt={product.name} className={styles.mainImage} />
          </div>
          <div className={styles.details}>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>${product.price}</p>
            <p className={styles.desc}>{product.description}</p>
            {product.sizes.length > 1 && (
              <div className={styles.field}>
                <label className={styles.label}>Size</label>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((s) => (
                    <button key={s} type="button" className={size === s ? styles.sizeActive : styles.sizeBtn} onClick={() => setSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Quantity</label>
              <div className={styles.quantityWrap}>
                <button type="button" className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button type="button" className={styles.qtyBtn} onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>
            {!user && <p className={styles.loginHint}>Log in to add items to your cart.</p>}
            <button type="button" className={added ? styles.addBtnAdded : styles.addBtn} onClick={handleAddToCart} disabled={added}>
              {added ? 'Added to cart' : user ? 'Add to cart' : 'Log in to add to cart'}
            </button>
            {user && <button type="button" className={styles.cartLink} onClick={() => navigate('/cart')}>View cart →</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
