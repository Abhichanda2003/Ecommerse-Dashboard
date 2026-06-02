import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const toast = useToast()

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(id)
    }
  }

  const handleCheckout = () => {
    try {
      toast.show('Checkout feature coming soon')
    } catch (e) {
      // ignore if toast unavailable
    }
  }

  if (!cart.length) {
    return (
      <main className="container page">
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <button className="btn secondary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </main>
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const subtotal = cart.reduce(
    (sum, item) => sum + ((item.product?.price ?? item.price ?? 0) * (item.quantity || 0)),
    0,
  )

  return (
    <main className="container page">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button type="button" className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-page-grid">
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
                <button className="remove" onClick={() => handleRemove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Price</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button type="button" className="btn checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </main>
  )
}
