import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    const result = signup(name.trim(), email, password)
    if (result.error) { setError(result.error); return }
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign up</h1>
        <p className={styles.sub}>Create an account to shop and checkout.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={styles.input} placeholder="Your name" /></label>
          <label className={styles.label}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={styles.input} placeholder="you@example.com" /></label>
          <label className={styles.label}>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className={styles.input} placeholder="At least 6 characters" minLength={6} /></label>
          <label className={styles.label}>Confirm password<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className={styles.input} placeholder="••••••••" /></label>
          <button type="submit" className={styles.submitBtn}>Sign up</button>
        </form>
        <p className={styles.footer}>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  )
}
