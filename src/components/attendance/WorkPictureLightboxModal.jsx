import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

export default function WorkPictureLightboxModal({ open, urls, index, onClose, onIndexChange }) {
  if (!open || !urls?.length) {
    return null;
  }

  const safeIndex = Math.min(Math.max(0, index), urls.length - 1);
  const url = urls[safeIndex];
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < urls.length - 1;
  const title =
    urls.length > 1 ? `Proof of work (${safeIndex + 1} of ${urls.length})` : 'Proof of work';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
      <div className="relative z-10 flex max-h-[min(90vh,40rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 px-4 py-3">
          <p className="text-sm font-semibold text-on-surface">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
            aria-label="Close"
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-container-low p-4">
          <img
            src={url}
            alt="Work proof"
            className="max-h-[min(70vh,32rem)] max-w-full rounded-lg object-contain"
          />
        </div>
        {urls.length > 1 ? (
          <div className="flex justify-between gap-2 border-t border-outline-variant/30 px-4 py-3">
            <Button size="sm" variant="secondary" disabled={!hasPrev} onClick={() => onIndexChange(safeIndex - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="secondary" disabled={!hasNext} onClick={() => onIndexChange(safeIndex + 1)}>
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
