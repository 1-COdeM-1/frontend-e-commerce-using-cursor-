import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getFeaturedProducts } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import styles from './Home.module.css'

export default function Home() {
  const { products } = useProducts()
  const featured = getFeaturedProducts(products)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>New collection</p>
          <h1 className={styles.heroTitle}>Wear what <span className={styles.accent}>you</span> want.</h1>
          <p className={styles.heroSub}>Premium merch and tees. Limited drops, no compromise.</p>
          <Link to="/shop" className={styles.heroCta}>Shop now</Link>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImageWrap}>
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" alt="" className={styles.heroImage} />
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <Link to="/shop" className={styles.sectionLink}>View all</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Free shipping on orders over $50</h2>
          <Link to="/shop" className={styles.ctaBtn}>Shop all</Link>
        </div>
      </section>
    </div>
  )
}
