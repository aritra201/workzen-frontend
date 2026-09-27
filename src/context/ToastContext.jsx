import { useCallback, useMemo, useRef, useState } from 'react';
import ToastViewport from '../components/common/ToastViewport.jsx';
import { ToastContext } from './toastContext.js';

const DEFAULT_DURATION_MS = 6000;

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback(
    ({ message, type = 'error', duration = DEFAULT_DURATION_MS }) => {
      const text = String(message || '').trim();
      if (!text) {
        return;
      }
      const id = nextId();
      setToasts((current) => [...current, { id, message: text, type }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      show: push,
      error: (message, options) => push({ ...options, message, type: 'error' }),
      success: (message, options) => push({ ...options, message, type: 'success' }),
      dismiss,
    }),
    [push, dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
