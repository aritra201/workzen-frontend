import { SHIFT_STATUS } from '../constants/shifts.js';
import { formatShiftResponseKey } from './shiftLabels.js';

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
  for (const shift of Object.values(shifts || {})) {
    if (shift?.amount != null && !Number.isNaN(Number(shift.amount))) {
      total += Number(shift.amount);
      hasAmount = true;
    }
  }
  return hasAmount ? total : null;
}

export function attendanceVerificationStatus(shifts) {
  const active = Object.values(shifts || {}).filter(Boolean);
  if (!active.length) {
    return { label: 'Not Marked Attendance', tone: 'neutral' };
  }
  const statuses = active.map((s) => s.status);
  if (statuses.some((s) => s === SHIFT_STATUS.PENDING_VERIFICATION)) {
    return { label: 'Pending verification', tone: 'pending' };
  }
  if (statuses.every((s) => s === SHIFT_STATUS.VERIFIED)) {
    return { label: 'Verified', tone: 'verified' };
  }
  if (statuses.some((s) => s === SHIFT_STATUS.REJECTED)) {
    return { label: 'Rejected', tone: 'rejected' };
  }
  return { label: 'In review', tone: 'pending' };
}

/** @deprecated use formatAttendanceShiftNames */
export function shiftVerificationSummary(shifts) {
  return formatAttendanceShiftNames(shifts);
}
