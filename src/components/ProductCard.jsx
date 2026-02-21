import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  return (
    <article className={styles.card}>
      <Link to={`/shop/${product.slug}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} loading="lazy" />
        <span className={styles.overlay}>View</span>
      </Link>
      <div className={styles.info}>
        <h3 className={styles.name}><Link to={`/shop/${product.slug}`}>{product.name}</Link></h3>
        <p className={styles.price}>${product.price}</p>
      </div>
    </article>
  )
}
