import Icon from '../ui/Icon.jsx';

const typeStyles = {
  error: 'border-error/40 bg-error-container text-on-error-container',
  success: 'border-status-verified/40 bg-emerald-50 text-emerald-900 dark:bg-status-verified/15 dark:text-status-verified',
};

export default function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          role="alert"
          className={`pointer-events-auto flex w-full max-w-md items-start gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-lg ${typeStyles[item.type] ?? typeStyles.error}`}
        >
          <Icon
            name={item.type === 'success' ? 'check_circle' : 'error'}
            size={20}
            className="mt-0.5 shrink-0"
          />
          <p className="min-w-0 flex-1 font-medium leading-snug">{item.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            className="shrink-0 rounded-md p-0.5 opacity-80 hover:opacity-100"
            aria-label="Dismiss"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
