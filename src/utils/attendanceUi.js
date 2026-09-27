import { SHIFT_KEY, SHIFT_META, SHIFT_STATUS } from '../constants/shifts.js';
import { shiftStatusChipTone } from './shiftLabels.js';

export function shiftFromResponse(attendance, shiftKey) {
  const meta = SHIFT_META[shiftKey];
  if (!meta) {
    return null;
  }
  const data = attendance?.shifts?.[meta.responseKey];
  if (shiftKey === SHIFT_KEY.DAY || shiftKey === SHIFT_KEY.NIGHT) {
    return data ?? { marked: false };
  }
  return data;
}

export function isShiftVisible(attendance, shiftKey) {
  if (shiftKey === SHIFT_KEY.DAY || shiftKey === SHIFT_KEY.NIGHT) {
    return true;
  }
  const data = shiftFromResponse(attendance, shiftKey);
  return Boolean(data?.declared);
}

export function statusTone(status, lockAttendance) {
  if (lockAttendance) {
    return 'locked';
  }
  if (!status) {
    return 'neutral';
  }
  return shiftStatusChipTone(status);
}

export function statusLabel(status, lockAttendance) {
  if (lockAttendance) {
    return 'Locked';
  }
  switch (status) {
    case SHIFT_STATUS.VERIFIED:
      return 'Verified';
    case SHIFT_STATUS.REJECTED:
      return 'Rejected';
    case SHIFT_STATUS.PENDING_VERIFICATION:
      return 'Pending verification';
    case SHIFT_STATUS.AWAITING_ATTENDANCE:
      return 'Awaiting attendance';
    case SHIFT_STATUS.AWAITING_SUBMISSION:
      return 'Awaiting submission';
    default:
      return 'Not submitted';
  }
}
