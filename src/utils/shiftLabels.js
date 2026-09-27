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
    case SHIFT_STATUS.AWAITING_ATTENDANCE:
      return 'Awaiting attendance';
    case SHIFT_STATUS.AWAITING_SUBMISSION:
      return 'Awaiting submission';
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

/**
 * StatusChip tone per shift status. Colors match shift badges (see shiftChipStyles.js):
 * Verified=Day · Pending verification=Night · Awaiting submission=Extra Day · Awaiting attendance=Extra Night
 */
export function shiftStatusChipTone(status) {
  switch (status) {
    case SHIFT_STATUS.VERIFIED:
      return 'verified';
    case SHIFT_STATUS.REJECTED:
      return 'rejected';
    case SHIFT_STATUS.PENDING_VERIFICATION:
      return 'pending';
    case SHIFT_STATUS.AWAITING_ATTENDANCE:
      return 'awaitingAttendance';
    case SHIFT_STATUS.AWAITING_SUBMISSION:
      return 'awaitingSubmission';
    default:
      return 'neutral';
  }
}

export function responseKeyToApiShiftKey(responseKey) {
  return RESPONSE_KEY_TO_SHIFT_KEY[responseKey] ?? responseKey;
}
