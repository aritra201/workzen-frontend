import { parseHalfShiftSlot } from './halfShifts.js';

/**
 * Resolves comment thread payload for a shift accordion key (e.g. day, half_shift_1).
 */
export function getCommentThreadForShiftKey(record, shiftResponseKey) {
  const threads = record?.commentThreads;
  if (!threads) {
    return null;
  }
  if (parseHalfShiftSlot(shiftResponseKey)) {
    const list = threads.halfShifts || [];
    return list.find((t) => t?.shiftKey === shiftResponseKey) ?? null;
  }
  return threads[shiftResponseKey] ?? null;
}

/** Index 0 mirrors shift.comment (FR-073); list thread replies separately. */
export function getCommentThreadReplies(commentThread) {
  const messages = commentThread?.messages;
  if (!Array.isArray(messages) || messages.length <= 1) {
    return [];
  }
  return messages.slice(1);
}

export function formatCommentThreadAuthorRole(authorRole) {
  if (authorRole === 'admin') {
    return 'Admin';
  }
  if (authorRole === 'employee') {
    return 'Employee';
  }
  return authorRole ? String(authorRole) : 'User';
}
