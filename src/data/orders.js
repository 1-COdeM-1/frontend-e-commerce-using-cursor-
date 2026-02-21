const ORDERS_KEY = 'merch-store-orders'

export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveOrder(items) {
  const orders = getOrders()
  const order = {
    id: crypto.randomUUID?.() || `order-${Date.now()}`,
    date: new Date().toISOString(),
    items: items.map((item) => ({ productId: item.productId, name: item.name, quantity: item.quantity })),
  }
  orders.push(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getSalesByProduct() {
  const orders = getOrders()
  const byProduct = {}
  for (const order of orders) {
    for (const item of order.items) {
      byProduct[item.productId] = (byProduct[item.productId] || 0) + item.quantity
    }
  }
  return byProduct
}

export function clearOrders() {
  localStorage.setItem(ORDERS_KEY, '[]')
}

export function getSalesHistoryByProduct() {
  const orders = getOrders()
  const byProduct = {}
  for (const order of orders) {
    const orderDate = order.date || ''
    for (const item of order.items) {
      if (!byProduct[item.productId]) byProduct[item.productId] = []
      byProduct[item.productId].push({ date: orderDate, quantity: item.quantity })
    }
  }
  Object.keys(byProduct).forEach((id) => {
    byProduct[id].sort((a, b) => (b.date > a.date ? 1 : -1))
  })
  return byProduct
}
