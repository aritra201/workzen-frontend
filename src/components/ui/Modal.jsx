import Button from './Button.jsx';
import Icon from './Icon.jsx';

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  /** When false, clicking the backdrop does not close the dialog. */
  closeOnBackdrop = false,
  showCloseButton = true,
  /** When true, hides the close control and ignores backdrop close. */
  preventClose = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40"
        aria-hidden
        onClick={closeOnBackdrop && !preventClose ? onClose : undefined}
      />
      <div
        className="relative z-10 flex max-h-[min(92vh,100dvh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:max-h-[90vh] sm:rounded-2xl pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-on-surface">{title}</h2>
          {showCloseButton && onClose && !preventClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low"
              aria-label="Close"
            >
              <Icon name="close" size={22} />
            </button>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="mt-6 flex shrink-0 flex-wrap justify-end gap-2">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel = 'Save',
  loading,
  confirmVariant = 'primary',
}) {
  return (
    <>
      <Button variant="ghost" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </>
  );
}
