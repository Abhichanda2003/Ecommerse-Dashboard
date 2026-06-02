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

  return (
    <main className="container page">
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
        </div>
      </div>

      {loading && (
        <div className="loader">Loading products...</div>
      )}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div
            className="empty-state"
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 12,
              background: 'var(--code-bg)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <h3>No Products Found</h3>
            <p style={{ marginTop: 8, marginBottom: 8 }}>Try:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 20, display: 'inline-block', textAlign: 'left' }}>
              <li>Changing the search term</li>
              <li>Selecting a different category</li>
              <li>Clearing filters</li>
            </ul>
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
