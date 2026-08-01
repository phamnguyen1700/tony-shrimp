import { useState, useEffect } from 'react'

export interface CartItem {
  productId: string
  slug: string
  name: string
  grade?: string
  imageKey: string
  price: number
  quantity: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tony-cart') ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('tony-cart', JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }

  function removeItem(productId: string) {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  function updateQuantity(productId: string, qty: number) {
    if (qty <= 0) return removeItem(productId)
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }
}
