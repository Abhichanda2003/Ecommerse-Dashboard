import React, { createContext, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((p) => p.id !== t.id))
      }, t.duration || 3000),
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts])

  const show = (message, opts = {}) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, duration: opts.duration || 3000 }])
  }

  const value = { show }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastContext
