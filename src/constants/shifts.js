export const SHIFT_KEY = {
  DAY: 'day',
  NIGHT: 'night',
  EXTRA_DAY: 'extra_day',
  EXTRA_NIGHT: 'extra_night',
};

export const SHIFT_META = {
  [SHIFT_KEY.DAY]: { label: 'Day Shift', short: 'Day', responseKey: 'day' },
  [SHIFT_KEY.NIGHT]: { label: 'Night Shift', short: 'Night', responseKey: 'night' },
  [SHIFT_KEY.EXTRA_DAY]: { label: 'Extra Day', short: 'Extra Day', responseKey: 'extraDay' },
  [SHIFT_KEY.EXTRA_NIGHT]: { label: 'Extra Night', short: 'Extra Night', responseKey: 'extraNight' },
};

export const SHIFT_STATUS = {
  AWAITING_ATTENDANCE: 'awaiting_attendance',
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};
