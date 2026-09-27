import Icon from '../ui/Icon.jsx';

export default function ShiftWorkCommentPanel({ comment, className = '' }) {
  const text = comment?.trim();

  return (
    <aside className={`ledger-panel p-3 ${className}`}>
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container text-primary">
          <Icon name="chat_bubble" size={16} />
        </span>
        <p className="label-caps text-on-surface-variant">Work comment</p>
      </div>
      {text ? (
        <p className="mt-2 text-sm leading-snug text-on-surface">{text}</p>
      ) : (
        <p className="mt-2 text-sm text-on-surface-variant">No comment provided for this shift.</p>
      )}
    </aside>
  );
}
