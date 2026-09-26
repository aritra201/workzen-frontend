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
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40"
        aria-hidden
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        className="relative z-10 w-full max-w-lg rounded-t-2xl bg-surface-container-lowest p-6 shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-on-surface">{title}</h2>
          {showCloseButton && onClose ? (
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
        <div>{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
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
      <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
      <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
        {loading ? 'Please wait…' : confirmLabel}
      </Button>
    </>
  );
}
