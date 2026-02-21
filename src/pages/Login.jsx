import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.error) { setError(result.error); return }
    navigate(redirect, { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.sub}>Sign in to add items to your cart and checkout.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={styles.input} placeholder="you@example.com" /></label>
          <label className={styles.label}>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={styles.input} placeholder="••••••••" /></label>
          <button type="submit" className={styles.submitBtn}>Log in</button>
        </form>
        <p className={styles.footer}>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}
