import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const ThemeIcon = theme === 'dark' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  )

  return (
    <header className={styles.header}>

      {/* ── Mobile-only top bar (logged in, < 600px) ── */}
      {user && (
        <div className={styles.mobileTopBar}>
          {/* Left: cart + theme */}
          <div className={styles.mobileLeft}>
            <button type="button" onClick={toggleTheme} className={styles.themeBtn} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              {ThemeIcon}
            </button>
            <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
            </Link>
          </div>
          {/* Right: Hi name + logout */}
          <div className={styles.mobileRight}>
            <span className={styles.userName}>Hi, {user.name}</span>
            <button type="button" onClick={logout} className={styles.logoutBtn}>Log out</button>
          </div>
        </div>
      )}

      {/* ── Main nav row ── */}
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>STREETWEAR</Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/shop" className={styles.navLink}>Shop</Link>
          {(user?.email === 'admin@admin.com' || user?.isAdmin) && (
            <Link to="/admin" className={styles.adminLink}>Admin</Link>
          )}
        </nav>

        {/* ── Desktop actions (hidden on mobile when logged in) ── */}
        <div className={styles.actions}>
          {user ? (
            <span className={styles.desktopUserActions}>
              <span className={styles.userName}>Hi, {user.name}</span>
              <button type="button" onClick={logout} className={styles.logoutBtn}>Log out</button>
            </span>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>Log in</Link>
              <Link to="/signup" className={styles.signupBtn}>Sign up</Link>
            </>
          )}
          <button type="button" onClick={toggleTheme} className={`${styles.themeBtn} ${styles.desktopTheme}`} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {ThemeIcon}
          </button>
          {user && (
            <Link to="/cart" className={`${styles.cartBtn} ${styles.desktopCart}`} aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
