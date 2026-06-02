import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('ec_cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('ec_cart', JSON.stringify(cart))
    } catch (e) {
      // ignore
    }
  }, [cart])

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === product.id)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { id: product.id, product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((it) => it.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it)),
    )
  }

  const clearCart = () => setCart([])

  const cartCount = useMemo(() => cart.reduce((s, it) => s + it.quantity, 0), [cart])

  const total = useMemo(() => cart.reduce((s, it) => s + it.product.price * it.quantity, 0), [cart])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartContext
