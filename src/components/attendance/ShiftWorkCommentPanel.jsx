import Icon from '../ui/Icon.jsx';

export default function ShiftWorkCommentPanel({ comment, className = '' }) {
  const text = comment?.trim();

  return (
    <aside
      className={`rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-surface-container-low p-4 shadow-sm md:min-h-[140px] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-primary/15 pb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon name="chat_bubble" size={18} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Work comment</p>
      </div>
      {text ? (
        <p className="mt-3 text-sm font-medium leading-relaxed text-on-surface">{text}</p>
      ) : (
        <p className="mt-3 text-sm italic text-on-surface-variant">No comment provided for this shift.</p>
      )}
    </aside>
  );
}
