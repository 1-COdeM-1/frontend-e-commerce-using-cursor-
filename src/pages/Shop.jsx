import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductsByCategory } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import styles from './Shop.module.css'

export default function Shop() {
  const { products, categories } = useProducts()
  const [searchParams] = useSearchParams()
  const cat = searchParams.get('cat') || ''
  const filtered = getProductsByCategory(products, cat || undefined)

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>Shop</h1>
          <p className={styles.sub}>Tees, hoodies, caps & more.</p>
        </header>
        <div className={styles.filters}>
          <Link to="/shop" className={cat === '' ? styles.filterActive : styles.filterLink}>All</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?cat=${c.id}`} className={cat === c.id ? styles.filterActive : styles.filterLink}>{c.name}</Link>
          ))}
        </div>
        <div className={styles.grid}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 && <p className={styles.empty}>No products in this category yet.</p>}
      </div>
    </div>
  )
}
