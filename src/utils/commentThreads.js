import { isHalfShiftKey, normalizeHalfShiftApiKey } from './halfShifts.js';
import { responseKeyToApiShiftKey } from './shiftLabels.js';

/**
 * Resolves comment thread payload for a shift accordion key (e.g. day, halfShiftDay).
 */
export function getCommentThreadForShiftKey(record, shiftResponseKey) {
  const threads = record?.commentThreads;
  if (!threads) {
    return null;
  }

  if (threads[shiftResponseKey]) {
    return threads[shiftResponseKey];
  }

  const apiKey = responseKeyToApiShiftKey(shiftResponseKey);
  if (isHalfShiftKey(apiKey)) {
    const normalized = normalizeHalfShiftApiKey(apiKey);
    const legacyList = threads.halfShifts || [];
    return legacyList.find((t) => normalizeHalfShiftApiKey(t?.shiftKey) === normalized) ?? null;
  }

  return null;
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
