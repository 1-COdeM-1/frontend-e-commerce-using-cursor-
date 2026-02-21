export function getBotResponse(message, products = [], categories = []) {
  const raw = (message || '').trim().toLowerCase()
  if (!raw) return { text: "Type a message and I'll help you find products or answer questions!", products: [] }

  if (/^(hi|hello|hey)$/i.test(raw) || (raw.length <= 10 && /hi|hello|hey/.test(raw))) {
    return { text: "Hi! 👋 I'm here to help. Ask for product suggestions (e.g. \"t-shirts\", \"under $30\") or about shipping and returns.", products: [] }
  }
  if (/\b(help|what can you do)\b/.test(raw)) {
    return { text: "I can suggest products by category (t-shirts, hoodies, caps, accessories), by price (e.g. \"under $30\"), or answer questions about shipping and returns. Just ask!", products: [] }
  }
  if (/\b(shipping|delivery|free shipping)\b/.test(raw)) {
    return { text: "**Shipping:** Free on orders over $50. Orders usually ship in 1–2 business days; delivery typically 5–7 days.", products: [] }
  }
  if (/\b(return|refund|exchange)\b/.test(raw)) {
    return { text: "**Returns:** Unworn items can be returned within 30 days for a full refund or exchange. Contact us for a return label.", products: [] }
  }
  if (/\b(t-?shirt|tee|tees|shirt)\b/.test(raw)) {
    const tees = products.filter((p) => p.category === 'tees').slice(0, 4)
    return { text: tees.length ? "Here are some **T-Shirts**:" : "No t-shirts in stock right now.", products: tees }
  }
  if (/\b(hoodie|hoodies)\b/.test(raw)) {
    const hoodies = products.filter((p) => p.category === 'hoodies').slice(0, 4)
    return { text: hoodies.length ? "Here are some **Hoodies**:" : "No hoodies at the moment.", products: hoodies }
  }
  if (/\b(cap|caps|hat)\b/.test(raw)) {
    const caps = products.filter((p) => p.category === 'caps').slice(0, 4)
    return { text: caps.length ? "Check out these **Caps**:" : "No caps in stock.", products: caps }
  }
  if (/\b(accessor|tote|sticker)\b/.test(raw)) {
    const acc = products.filter((p) => p.category === 'accessories').slice(0, 4)
    return { text: acc.length ? "Here are **Accessories**:" : "No accessories right now.", products: acc }
  }
  const priceMatch = raw.match(/\bunder\s*\$?\s*(\d+)\b|cheap|budget\b/)
  if (priceMatch) {
    const maxPrice = priceMatch[1] ? parseInt(priceMatch[1], 10) : 35
    const filtered = products.filter((p) => p.price <= maxPrice).slice(0, 4)
    return { text: filtered.length ? `Options **under $${maxPrice}**:` : `Nothing under $${maxPrice}. Try a higher amount!`, products: filtered }
  }
  if (/\b(featured|popular|recommend)\b/.test(raw)) {
    const featured = products.filter((p) => p.featured).slice(0, 4)
    const fallback = featured.length ? featured : products.slice(0, 3)
    return { text: fallback.length ? "**Popular picks**:" : "Browse the shop!", products: fallback }
  }
  const byName = products.filter((p) => raw.split(/\s+/).some((w) => w.length > 2 && p.name.toLowerCase().includes(w)))
  if (byName.length > 0) return { text: `I found these matching **"${raw}"**:`, products: byName.slice(0, 4) }
  const suggested = products.filter((p) => p.featured).slice(0, 3).length ? products.filter((p) => p.featured).slice(0, 3) : products.slice(0, 3)
  return { text: "Try asking for **t-shirts**, **hoodies**, **under $30**, or **shipping** — or describe what you're looking for!", products: suggested }
}
