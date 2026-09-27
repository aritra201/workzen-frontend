/**
 * Shared shift badge surfaces (list SHIFT column). Status chips reuse the same palette:
 * Day → Verified · Night → Pending verification · Extra Day → Awaiting submission · Extra Night → Awaiting attendance
 */
export const SHIFT_CHIP_CLASS = {
  day:
    'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  night:
    'bg-blue-100 text-blue-800 ring-1 ring-blue-200/80 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30',
  extraDay:
    'bg-amber-100 text-amber-900 ring-1 ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30',
  extraNight:
    'bg-orange-100 text-orange-900 ring-1 ring-orange-200/80 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/30',
};

export const SHIFT_CHIP_DOT_CLASS = {
  day: 'bg-emerald-700 dark:bg-emerald-400',
  night: 'bg-blue-700 dark:bg-blue-400',
  extraDay: 'bg-amber-800 dark:bg-amber-400',
  extraNight: 'bg-orange-800 dark:bg-orange-400',
};

/** StatusChip tone → shift palette key */
export const STATUS_TONE_SHIFT_KEY = {
  verified: 'day',
  pending: 'night',
  awaitingSubmission: 'extraDay',
  awaitingAttendance: 'extraNight',
};
