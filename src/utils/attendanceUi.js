import { SHIFT_KEY, SHIFT_META, SHIFT_STATUS } from '../constants/shifts.js';
import { shiftStatusChipTone } from './shiftLabels.js';

export function shiftFromResponse(attendance, shiftKey) {
  const meta = SHIFT_META[shiftKey];
  if (!meta) {
    return null;
  }
  const data = attendance?.shifts?.[meta.responseKey];
  return data ?? { marked: false };
}

export function isShiftVisible(_attendance, shiftKey) {
  return Boolean(SHIFT_META[shiftKey]);
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

/** Comment and work pictures cannot be changed after verification (or rejection). */
export function isShiftDetailsLockedForEmployee(shift, attendance) {
  if (attendance?.lockAttendance || attendance?.canEdit === false) {
    return true;
  }
  const status = shift?.status;
  return status === SHIFT_STATUS.VERIFIED || status === SHIFT_STATUS.REJECTED;
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
