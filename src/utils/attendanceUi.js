import { SHIFT_KEY, SHIFT_META, SHIFT_STATUS } from '../constants/shifts.js';
import { shiftStatusChipTone } from './shiftLabels.js';
import { isHalfShiftKey } from './halfShifts.js';

export function shiftFromResponse(attendance, shiftKey) {
  const meta = SHIFT_META[shiftKey];
  if (!meta) {
    return null;
  }
  const data = attendance?.shifts?.[meta.responseKey];
  return data ?? { marked: false };
}

export function isShiftVisible(_attendance, shiftKey) {
  return Boolean(SHIFT_META[shiftKey]) || isHalfShiftKey(shiftKey);
}

/** Cards shown on Mark attendance (fixed shifts + dynamic half shift slots). */
export function listMarkAttendanceShiftItems(attendance) {
  const fixedOrder = [
    SHIFT_KEY.DAY,
    SHIFT_KEY.NIGHT,
    SHIFT_KEY.EXTRA_DAY,
    SHIFT_KEY.EXTRA_NIGHT,
  ];
  const fixed = fixedOrder
    .filter((key) => isShiftVisible(attendance, key))
    .map((shiftKey) => ({
      shiftKey,
      shift: shiftFromResponse(attendance, shiftKey),
      accordionId: shiftKey,
    }));

  const half = (attendance?.shifts?.halfShifts ?? []).map((entry) => {
    const shift =
      entry?.marked ? entry : { ...entry, status: undefined };
    return {
      shiftKey: entry.shiftKey,
      shift,
      accordionId: entry.shiftKey,
    };
  });

  return [...fixed, ...half];
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
