import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const toast = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || 'Unable to load product'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="container page">
        <div className="loader">Loading product...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container page">
        <div className="error">{error}</div>
      </main>
    )
  }

  if (!product) {
    return null
  }

  const image = product.thumbnail || product.images?.[0] || ''
  const inStock = product.stock > 0

  return (
    <main className="container page">
      <button type="button" className="clear-filters-btn" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="product-details">
        <div className="product-details-image">
          <img src={image} alt={product.title} />
        </div>
        <div className="product-details-info">
          <h1>{product.title}</h1>
          <p className="product-details-description">{product.description}</p>
          <div className="product-details-meta">
            <span>${product.price}</span>
            <span>⭐ {product.rating}</span>
            <span>{product.category}</span>
            <span className={`stock ${inStock ? 'in' : 'out'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <button
            className="btn"
            onClick={() => {
              addToCart(product)
              try {
                toast.show(`${product.title} added to cart`)
              } catch (e) {
                // ignore toast errors
              }
            }}
            disabled={!inStock}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  )
}
