export const SHIFT_KEY = {
  DAY: 'day',
  NIGHT: 'night',
  EXTRA_DAY: 'extra_day',
  EXTRA_NIGHT: 'extra_night',
  HALF_SHIFT_DAY: 'half_shift_day',
  HALF_SHIFT_NIGHT: 'half_shift_night',
};

export const SHIFT_META = {
  [SHIFT_KEY.DAY]: { label: 'Day Shift', short: 'Day', responseKey: 'day' },
  [SHIFT_KEY.NIGHT]: { label: 'Night Shift', short: 'Night', responseKey: 'night' },
  [SHIFT_KEY.EXTRA_DAY]: { label: 'Extra Day', short: 'Extra Day', responseKey: 'extraDay' },
  [SHIFT_KEY.EXTRA_NIGHT]: { label: 'Extra Night', short: 'Extra Night', responseKey: 'extraNight' },
  [SHIFT_KEY.HALF_SHIFT_DAY]: {
    label: 'Half Shift Day',
    short: 'Half Day',
    responseKey: 'halfShiftDay',
  },
  [SHIFT_KEY.HALF_SHIFT_NIGHT]: {
    label: 'Half Shift Night',
    short: 'Half Night',
    responseKey: 'halfShiftNight',
  },
};

export const SHIFT_STATUS = {
  AWAITING_ATTENDANCE: 'awaiting_attendance',
  AWAITING_SUBMISSION: 'awaiting_submission',
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};
