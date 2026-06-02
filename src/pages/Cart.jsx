import React from 'react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total } = useCart()

  if (!cart.length) {
    return (
      <main className="container page">
        <h2>Your cart is empty</h2>
      </main>
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const subtotal = cart.reduce(
    (sum, item) => sum + ((item.price ?? item.product?.price ?? 0) * (item.quantity || 0)),
    0,
  )

  return (
    <main className="container page">
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cart.map((it) => (
          <div className="cart-item" key={it.id}>
            <img src={it.product.thumbnail || it.product.images?.[0]} alt={it.product.title} />
            <div className="cart-item-body">
              <div className="cart-item-title">{it.product.title}</div>
              <div className="cart-item-meta">${it.product.price} • {it.product.category}</div>
              <div className="qty">
                <button onClick={() => updateQuantity(it.id, it.quantity - 1)}>-</button>
                <span>{it.quantity}</span>
                <button onClick={() => updateQuantity(it.id, it.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-actions">
              <div className="subtotal">${(it.product.price * it.quantity).toFixed(2)}</div>
              <button className="remove" onClick={() => removeFromCart(it.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="order-summary"
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          background: 'var(--code-bg)',
          border: '1px solid var(--border)',
        }}
      >
        <h3>Order Summary</h3>
        <div>Items: {totalItems}</div>
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div style={{ marginTop: 8, fontWeight: 700 }}>Total: ${subtotal.toFixed(2)}</div>
      </div>
    </main>
  )
}
