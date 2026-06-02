import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import useDebounce from '../hooks/useDebounce'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('https://dummyjson.com/products?limit=100')
      .then((res) => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then((data) => {
        setProducts(data.products || [])
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['All Categories', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    let list = products.slice()
    if (category && category !== 'All Categories') {
      list = list.filter((p) => p.category === category)
    }
    if (debouncedSearch && debouncedSearch.trim() !== '') {
      const q = debouncedSearch.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'rating-desc') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, category, debouncedSearch, sort])

  const totalProducts = products.length
  const filteredCount = filtered.length
  const totalCategories = categories.length - 1
  const inStockCount = products.reduce((sum, item) => sum + (item.stock > 0 ? 1 : 0), 0)
  const outOfStockCount = totalProducts - inStockCount

  const clearFilters = () => {
    setSearch('')
    setCategory('All Categories')
    setSort('')
  }

  return (
    <main className="container page">
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">📦</div>
          <div>
            <p className="analytics-label">Total Products</p>
            <p className="analytics-value">{totalProducts}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">📂</div>
          <div>
            <p className="analytics-label">Categories</p>
            <p className="analytics-value">{totalCategories}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">✅</div>
          <div>
            <p className="analytics-label">In Stock</p>
            <p className="analytics-value">{inStockCount}</p>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon">❌</div>
          <div>
            <p className="analytics-label">Out of Stock</p>
            <p className="analytics-value">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <div className="controls">
        <SearchBar value={search} onChange={setSearch} />

        <div className="filters">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>

          <button type="button" className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="product-count">
        Showing {filteredCount} of {totalProducts} Products
      </div>

      {loading && (
        <div className="loader">Loading products...</div>
      )}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No Products Found</h3>
            <p>Try changing search or clearing filters</p>
            <button type="button" className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <section className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        )
      )}
    </main>
  )
}
