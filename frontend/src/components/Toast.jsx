import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'info', timeout = 3500) => {
    const id = ++idCounter
    setToasts(t => [...t, { id, message, type }])
    setTimeout(()=>{
      setToasts(t => t.filter(x=>x.id !== id))
    }, timeout)
    return id
  }, [])

  const dismiss = useCallback((id) => setToasts(t => t.filter(x=>x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="toast-container">
        {toasts.map(t=> (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if(!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
