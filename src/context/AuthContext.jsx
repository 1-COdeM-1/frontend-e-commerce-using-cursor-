import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'merch-store-users'
const USER_KEY = 'merch-store-user'

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCurrentUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadCurrentUser)

  useEffect(() => {
    saveCurrentUser(user)
  }, [user])

  const signup = (name, email, password) => {
    const users = loadUsers()
    const trimmed = email.trim().toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === trimmed)) {
      return { error: 'An account with this email already exists.' }
    }
    const id = crypto.randomUUID?.() || Date.now().toString(36)
    const newUser = { id, name, email: trimmed, password }
    users.push(newUser)
    saveUsers(users)
    setUser({ id, name, email: newUser.email })
    return { ok: true }
  }

  const login = (email, password) => {
    const trimmed = email.trim().toLowerCase()
    if (trimmed === 'admin@admin.com' && password === '889900') {
      setUser({ id: 'admin', name: 'Admin', email: 'admin@admin.com', isAdmin: true })
      return { ok: true }
    }
    const users = loadUsers()
    const found = users.find((u) => u.email.toLowerCase() === trimmed && u.password === password)
    if (!found) return { error: 'Invalid email or password.' }
    setUser({ id: found.id, name: found.name, email: found.email })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
