import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { cartCount } = useCart()

  return (
    <header className="app-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <h2>Product Dashboard</h2>
        </Link>

        <nav className="nav">
          <Link to="/cart" className="cart-link">
            Cart <span className="cart-count">{cartCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
