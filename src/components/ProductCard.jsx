import React from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const toast = useToast()

  const img = product.thumbnail || (product.images && product.images[0]) || ''

  return (
    <div className="card">
      <div className="card-media">
        <img src={img} alt={product.title} />
        <span className={`stock ${product.stock > 0 ? 'in' : 'out'}`}>
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <div className="card-meta">
          <div className="price">${product.price}</div>
          <div className="rating">⭐ {product.rating}</div>
        </div>
        <div className="category">{product.category}</div>
        <div className="actions">
          <button
            className="btn"
            onClick={() => {
              addToCart(product)
              try {
                toast.show(`${product.title} added to cart`)
              } catch (e) {
                // ignore if toast unavailable
              }
            }}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
