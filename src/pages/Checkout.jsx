import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { saveOrder } from '../data/orders'
import styles from './Checkout.module.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '', zip: '', country: '' })

  useEffect(() => {
    if (!user) navigate('/login?redirect=/checkout', { replace: true })
  }, [user, navigate])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    saveOrder(items)
    clearCart()
    setTimeout(() => navigate('/'), 3000)
  }

  if (!user) return null
  if (items.length === 0 && !submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.empty}>Your cart is empty.</p>
          <Link to="/shop" className={styles.link}>Go to shop</Link>
        </div>
      </div>
    )
  }
  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <h1 className={styles.successTitle}>Order placed</h1>
            <p className={styles.successSub}>Thanks for your order. We'll send a confirmation to your email.</p>
            <Link to="/shop" className={styles.successBtn}>Continue shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <Link to="/cart" className={styles.backLink}>← Back to cart</Link>
        <h1 className={styles.title}>Checkout</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Contact & shipping</h2>
              <div className={styles.fields}>
                <label className={styles.label}>Email<input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.input} placeholder="you@example.com" /></label>
                <label className={styles.label}>Full name<input type="text" name="name" value={form.name} onChange={handleChange} required className={styles.input} placeholder="Your name" /></label>
                <label className={styles.label}>Address<input type="text" name="address" value={form.address} onChange={handleChange} required className={styles.input} placeholder="Street address" /></label>
                <div className={styles.row}>
                  <label className={styles.label}>City<input type="text" name="city" value={form.city} onChange={handleChange} required className={styles.input} placeholder="City" /></label>
                  <label className={styles.label}>ZIP<input type="text" name="zip" value={form.zip} onChange={handleChange} required className={styles.input} placeholder="ZIP" /></label>
                </div>
                <label className={styles.label}>Country<input type="text" name="country" value={form.country} onChange={handleChange} required className={styles.input} placeholder="Country" /></label>
              </div>
            </div>
            <div className={styles.orderSection}>
              <div className={styles.orderCard}>
                <h2 className={styles.sectionTitle}>Order summary</h2>
                <ul className={styles.orderList}>
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.size}`} className={styles.orderRow}>
                      <div className={styles.orderItemInfo}>
                        <span className={styles.orderName}>{item.name}</span>
                        <span className={styles.orderMeta}>{item.size} × {item.quantity}</span>
                      </div>
                      <span className={styles.orderPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.orderTotal}><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
                <button type="submit" className={styles.submitBtn}>Place order</button>
                <p className={styles.disclaimer}>This is a demo. No payment is processed.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
