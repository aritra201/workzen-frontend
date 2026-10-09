import {
  formatCommentThreadAuthorRole,
  getCommentThreadReplies,
} from '../../utils/commentThreads.js';

function formatMessageTime(createdAt) {
  if (!createdAt) {
    return '';
  }
  try {
    return new Date(createdAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return '';
  }
}

export default function ShiftCommentThreadList({ commentThread, className = '' }) {
  const replies = getCommentThreadReplies(commentThread);

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="label-caps text-on-surface-variant">Thread</p>
      <ul className="space-y-2">
        {replies.map((message) => (
          <li
            key={message.id}
            className="rounded-md border border-outline-variant/30 bg-surface-container-lowest px-3 py-2"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold text-primary">
                {formatCommentThreadAuthorRole(message.authorRole)}
              </p>
              {message.createdAt ? (
                <p className="text-xs text-on-surface-variant">{formatMessageTime(message.createdAt)}</p>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-snug text-on-surface">{message.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
