import { SHIFT_KEY, SHIFT_META, SHIFT_STATUS } from '../constants/shifts.js';

const RESPONSE_KEY_TO_SHIFT_KEY = {
  day: SHIFT_KEY.DAY,
  night: SHIFT_KEY.NIGHT,
  extraDay: SHIFT_KEY.EXTRA_DAY,
  extraNight: SHIFT_KEY.EXTRA_NIGHT,
};

export function formatShiftResponseKey(responseKey) {
  const shiftKey = RESPONSE_KEY_TO_SHIFT_KEY[responseKey] ?? responseKey;
  const meta = SHIFT_META[shiftKey];
  if (meta?.short) {
    return meta.short;
  }
  return String(responseKey)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function formatShiftStatus(status) {
  switch (status) {
    case SHIFT_STATUS.PENDING_VERIFICATION:
      return 'Pending verification';
    case SHIFT_STATUS.VERIFIED:
      return 'Verified';
    case SHIFT_STATUS.REJECTED:
      return 'Rejected';
    default:
      if (!status) {
        return '—';
      }
      return String(status).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export function shiftStatusChipTone(status) {
  if (status === SHIFT_STATUS.VERIFIED) {
    return 'verified';
  }
  if (status === SHIFT_STATUS.REJECTED) {
    return 'rejected';
  }
  if (status === SHIFT_STATUS.PENDING_VERIFICATION) {
    return 'pending';
  }
  return 'neutral';
}

export function responseKeyToApiShiftKey(responseKey) {
  return RESPONSE_KEY_TO_SHIFT_KEY[responseKey] ?? responseKey;
}
