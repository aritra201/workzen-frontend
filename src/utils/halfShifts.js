import { SHIFT_KEY } from '../constants/shifts.js';

export const MAX_HALF_SHIFTS = 2;

const LEGACY_ALIASES = {
  half_shift_1: SHIFT_KEY.HALF_SHIFT_DAY,
  half_shift_2: SHIFT_KEY.HALF_SHIFT_NIGHT,
};

export function normalizeHalfShiftApiKey(shiftKey) {
  if (typeof shiftKey !== 'string') {
    return shiftKey;
  }
  const normalized = shiftKey.trim().toLowerCase();
  return LEGACY_ALIASES[normalized] ?? normalized;
}

export function parseHalfShiftSlot(shiftKey) {
  const key = normalizeHalfShiftApiKey(shiftKey);
  if (key === SHIFT_KEY.HALF_SHIFT_DAY) {
    return 1;
  }
  if (key === SHIFT_KEY.HALF_SHIFT_NIGHT) {
    return 2;
  }
  return null;
}

export function isHalfShiftKey(shiftKey) {
  const key = normalizeHalfShiftApiKey(shiftKey);
  return key === SHIFT_KEY.HALF_SHIFT_DAY || key === SHIFT_KEY.HALF_SHIFT_NIGHT;
}

export function halfShiftLabel(slotOrKey) {
  if (slotOrKey === 1 || slotOrKey === SHIFT_KEY.HALF_SHIFT_DAY) {
    return 'Half Shift Day';
  }
  if (slotOrKey === 2 || slotOrKey === SHIFT_KEY.HALF_SHIFT_NIGHT) {
    return 'Half Shift Night';
  }
  return 'Half shift';
}

export function getShiftDisplayMeta(shiftKey) {
  const key = normalizeHalfShiftApiKey(shiftKey);
  if (key === SHIFT_KEY.HALF_SHIFT_DAY) {
    return { label: 'Half Shift Day', short: 'Half Day' };
  }
  if (key === SHIFT_KEY.HALF_SHIFT_NIGHT) {
    return { label: 'Half Shift Night', short: 'Half Night' };
  }
  return null;
}
