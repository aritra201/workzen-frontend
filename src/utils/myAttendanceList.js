import {
  attendanceVerificationStatus,
  sumShiftAmounts,
} from './companyAttendanceList.js';

export function getMyAttendanceListItems(data) {
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

export function listRangeLastDays(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const toKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return { startDate: toKey(start), endDate: toKey(end) };
}

export { attendanceVerificationStatus, sumShiftAmounts };
