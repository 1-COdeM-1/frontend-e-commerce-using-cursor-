import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <span className={styles.logo}>STREETWEAR</span>
          <p className={styles.tagline}>Merch & tees for the culture.</p>
        </div>
        <div className={styles.links}>
          <h4 className={styles.heading}>Shop</h4>
          <Link to="/shop" className={styles.link}>All Products</Link>
          <Link to="/shop?cat=tees" className={styles.link}>T-Shirts</Link>
          <Link to="/shop?cat=hoodies" className={styles.link}>Hoodies</Link>
        </div>
        <div className={styles.links}>
          <h4 className={styles.heading}>Support</h4>
          <a href="#contact" className={styles.link}>Contact</a>
          <a href="#faq" className={styles.link}>FAQ</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} STREETWEAR. All rights reserved.</p>
      </div>
    </footer>
  )
}
