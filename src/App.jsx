import React from 'react'
import './App.css'
import Header from './components/Header'
import Products from './pages/Products'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  )
}

export default App
