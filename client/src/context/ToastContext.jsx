import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const getToastColors = (type) => {
    switch (type) {
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.92)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          shadow: '0 8px 32px 0 rgba(16, 185, 129, 0.2)'
        };
      case 'error':
        return {
          background: 'rgba(239, 68, 68, 0.92)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          shadow: '0 8px 32px 0 rgba(239, 68, 68, 0.2)'
        };
      case 'info':
      default:
        return {
          background: 'rgba(14, 165, 233, 0.92)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          shadow: '0 8px 32px 0 rgba(14, 165, 233, 0.2)'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '365px',
        width: '100%',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => {
          const colors = getToastColors(toast.type);
          return (
            <div
              key={toast.id}
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: colors.background,
                color: '#ffffff',
                border: colors.border,
                boxShadow: colors.shadow,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-body)',
                animation: 'slideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                {toast.type === 'success' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
                {toast.type === 'error' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastProvider;
