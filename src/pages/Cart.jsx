import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import styles from './Cart.module.css'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  useEffect(() => {
    if (!user) navigate('/login?redirect=/cart', { replace: true })
  }, [user, navigate])

  if (!user) return null
  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Your cart</h1>
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link to="/shop" className={styles.shopLink}>Continue shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>Your cart</h1>
        <p className={styles.sub}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        <div className={styles.grid}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className={styles.row}>
                <Link to={`/shop/${item.slug}`} className={styles.thumbWrap}>
                  <img src={item.image} alt={item.name} className={styles.thumb} />
                </Link>
                <div className={styles.itemInfo}>
                  <Link to={`/shop/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                  <p className={styles.itemMeta}>Size: {item.size}</p>
                  <p className={styles.itemPrice}>${item.price} each</p>
                </div>
                <div className={styles.qtyWrap}>
                  <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}>−</button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
                </div>
                <div className={styles.bottomRow}>
                  <p className={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</p>
                  <button type="button" className={styles.removeBtn} onClick={() => removeFromCart(item.productId, item.size)} aria-label="Remove">×</button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.sidebar}>
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <p className={styles.shippingNote}>Shipping calculated at checkout.</p>
              <Link to="/checkout" className={styles.checkoutBtn}>Checkout</Link>
              <Link to="/shop" className={styles.continueLink}>Continue shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
