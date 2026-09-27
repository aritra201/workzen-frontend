import { useEffect, useRef } from 'react';
import { useToast } from '../../hooks/useToast.js';

/**
 * @param {'toast' | 'inline' | 'both'} display
 *   toast (default) — floating toast above modals
 *   inline — banner in document flow
 *   both — toast + inline banner
 */
export default function ErrorMessage({ message, display = 'toast', className = '' }) {
  const toast = useToast();
  const lastToastedRef = useRef('');

  useEffect(() => {
    if (!message || display === 'inline') {
      return;
    }
    if (lastToastedRef.current === message) {
      return;
    }
    lastToastedRef.current = message;
    toast.error(message);
  }, [message, display, toast]);

  useEffect(() => {
    if (!message) {
      lastToastedRef.current = '';
    }
  }, [message]);

  const showInline = message && (display === 'inline' || display === 'both');
  if (!showInline) {
    return null;
  }

  return (
    <div
      className={`rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
