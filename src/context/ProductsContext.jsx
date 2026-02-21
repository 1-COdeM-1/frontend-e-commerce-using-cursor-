import { createContext, useContext, useState, useEffect } from 'react'
import { defaultProducts, categories as categoriesList } from '../data/products'

const ProductsContext = createContext(null)
const STORAGE_KEY = 'merch-store-products'

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts
    }
  } catch (_) {}
  return defaultProducts
}

function slugFromName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const addProduct = (data) => {
    const id = crypto.randomUUID?.() || `p-${Date.now()}`
    const slug = slugFromName(data.name) || `product-${id}`
    const newProduct = {
      id,
      name: data.name.trim(),
      slug,
      category: data.category || 'tees',
      price: Number(data.price) || 0,
      description: data.description?.trim() || '',
      image: data.image?.trim() || '',
      images: data.image ? [data.image.trim()] : [],
      sizes: data.sizes || ['S', 'M', 'L', 'XL'],
      colors: data.colors || ['Black'],
      featured: Boolean(data.featured),
    }
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, ...updates }
        if (updates.name !== undefined) next.slug = slugFromName(updates.name) || p.slug
        return next
      })
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductsContext.Provider
      value={{ products, categories: categoriesList, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
