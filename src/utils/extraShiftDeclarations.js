import { formatShiftResponseKey, formatShiftStatus, shiftStatusChipTone } from './shiftLabels.js';

const EXTRA_SHIFT_ORDER = ['extraDay', 'extraNight'];

export function isExtraDeclared(slot) {
  return Boolean(slot?.declared);
}

/** Chips input: only declared extra shifts (not regular day/night). */
export function declaredExtraShiftsForRow(row) {
  const shifts = {};
  if (isExtraDeclared(row?.extraDay)) {
    shifts.extraDay = row.extraDay;
  }
  if (isExtraDeclared(row?.extraNight)) {
    shifts.extraNight = row.extraNight;
  }
  return shifts;
}

/** Declared extra shifts on an admin declarations row → status entries (shift/status pairing). */
export function getExtraDeclarationShiftStatusEntries(row) {
  const entries = [];
  for (const responseKey of EXTRA_SHIFT_ORDER) {
    const shift = row?.[responseKey];
    if (!isExtraDeclared(shift)) {
      continue;
    }
    entries.push({
      responseKey,
      shiftLabel: formatShiftResponseKey(responseKey),
      label: formatShiftStatus(shift?.status),
      tone: shiftStatusChipTone(shift?.status),
    });
  }
  return entries;
}
