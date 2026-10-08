import { SHIFT_STATUS } from '../constants/shifts.js';
import { formatShiftResponseKey, formatShiftStatus, shiftStatusChipTone } from './shiftLabels.js';

/** @param {Record<string, unknown> | null | undefined} data */
export function getCompanyAttendanceListItems(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data.items)) {
    return data.items;
  }
  if (Array.isArray(data.records)) {
    return data.records;
  }
  return [];
}

export function getAttendanceEmployeeName(row) {
  return row?.employee?.name ?? row?.employeeName ?? '—';
}

export function getAttendanceEmployeeProfilePicture(row) {
  return row?.employee?.profilePicture ?? row?.employee?.profile_picture ?? null;
}

export function formatAttendanceShiftNames(shifts) {
  const names = Object.entries(shifts || {})
    .filter(([, shift]) => Boolean(shift))
    .map(([key]) => formatShiftResponseKey(key));
  return names.length ? names.join(', ') : '—';
}

export function sumShiftAmounts(shifts) {
  let total = 0;
  let hasAmount = false;
  for (const shift of Object.values(shiftsCountedForAttendanceStatus(shifts))) {
    if (shift?.amount != null && !Number.isNaN(Number(shift.amount))) {
      total += Number(shift.amount);
      hasAmount = true;
    }
  }
  return hasAmount ? total : null;
}

export function shiftsCountedForAttendanceStatus(shifts) {
  const counted = {};
  for (const [key, shift] of Object.entries(shifts || {})) {
    if (!shift || key === 'halfShifts') {
      continue;
    }
    if (key === 'extraDay' || key === 'extraNight') {
      if (shift.marked) {
        counted[key] = shift;
      }
      continue;
    }
    if (shift.marked) {
      counted[key] = shift;
    }
  }
  for (const half of shifts?.halfShifts || []) {
    if (half?.marked && half.shiftKey) {
      counted[half.shiftKey] = half;
    }
  }
  return counted;
}

/** One status chip per marked shift (for list STATUS column). */
export function getAttendanceShiftStatusEntries(shifts) {
  const counted = shiftsCountedForAttendanceStatus(shifts);
  return Object.entries(counted).map(([responseKey, shift]) => ({
    responseKey,
    shiftLabel: formatShiftResponseKey(responseKey),
    label: formatShiftStatus(shift?.status),
    tone: shiftStatusChipTone(shift?.status),
  }));
}

export function attendanceVerificationStatus(shifts) {
  const active = Object.values(shiftsCountedForAttendanceStatus(shifts));
  if (!active.length) {
    return { label: 'Not Marked Attendance', tone: 'notMarked' };
  }
  const statuses = active.map((s) => s.status);
  if (statuses.some((s) => s === SHIFT_STATUS.PENDING_VERIFICATION)) {
    return { label: 'Pending verification', tone: shiftStatusChipTone(SHIFT_STATUS.PENDING_VERIFICATION) };
  }
  if (statuses.some((s) => s === SHIFT_STATUS.AWAITING_SUBMISSION)) {
    return { label: 'Awaiting submission', tone: shiftStatusChipTone(SHIFT_STATUS.AWAITING_SUBMISSION) };
  }
  if (statuses.some((s) => s === SHIFT_STATUS.AWAITING_ATTENDANCE)) {
    return { label: 'Awaiting attendance', tone: shiftStatusChipTone(SHIFT_STATUS.AWAITING_ATTENDANCE) };
  }
  if (statuses.every((s) => s === SHIFT_STATUS.VERIFIED)) {
    return { label: 'Verified', tone: shiftStatusChipTone(SHIFT_STATUS.VERIFIED) };
  }
  if (statuses.some((s) => s === SHIFT_STATUS.REJECTED)) {
    return { label: 'Rejected', tone: shiftStatusChipTone(SHIFT_STATUS.REJECTED) };
  }
  return { label: 'In review', tone: 'pending' };
}

/** @deprecated use formatAttendanceShiftNames */
export function shiftVerificationSummary(shifts) {
  return formatAttendanceShiftNames(shifts);
}
