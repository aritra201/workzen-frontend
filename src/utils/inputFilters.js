export const INPUT_FILTER_MESSAGES = {
  alphabetic: "Only letters, spaces, and . ' - are allowed.",
  numeric: 'Only numbers are allowed.',
  phoneIndiaMax: 'For +91, enter up to 10 digits only (not 11 or more).',
  phoneIndiaLength: 'Indian phone numbers must be exactly 10 digits.',
  phoneOtherMax: 'Enter up to 20 digits only (not 21 or more).',
  phoneOtherLength: 'Phone number must be at most 20 digits.',
};

const DEFAULT_NATIONAL_PHONE_MAX = 20;

/** Letters, spaces, and common name punctuation (no digits). */
export function filterAlphabeticInput(value) {
  return String(value).replace(/[^a-zA-Z\s.'-]/g, '');
}

/** Digits only (phone, PIN/postal). */
export function filterNumericInput(value) {
  return String(value).replace(/\D/g, '');
}

/**
 * @param {'alphabetic' | 'numeric'} kind
 * @returns {{ value: string, rejected: boolean, message: string }}
 */
export function applyInputFilter(kind, rawValue) {
  const raw = String(rawValue);
  if (kind === 'alphabetic') {
    const value = filterAlphabeticInput(raw);
    const rejected = raw !== value;
    return {
      value,
      rejected,
      message: rejected ? INPUT_FILTER_MESSAGES.alphabetic : '',
    };
  }
  if (kind === 'numeric') {
    const value = filterNumericInput(raw);
    const rejected = raw !== value;
    return {
      value,
      rejected,
      message: rejected ? INPUT_FILTER_MESSAGES.numeric : '',
    };
  }
  return { value: raw, rejected: false, message: '' };
}

export function normalizeDialCode(countryCode) {
  return String(countryCode ?? '').replace(/\D/g, '');
}

export function maxNationalPhoneDigits(countryCode) {
  if (normalizeDialCode(countryCode) === '91') {
    return 10;
  }
  return DEFAULT_NATIONAL_PHONE_MAX;
}

function phoneMaxLengthMessage(countryCode) {
  return normalizeDialCode(countryCode) === '91'
    ? INPUT_FILTER_MESSAGES.phoneIndiaMax
    : INPUT_FILTER_MESSAGES.phoneOtherMax;
}

/**
 * National phone number (no country code), digits only; +91 capped at 10 digits.
 */
export function applyPhoneNationalInput(rawValue, countryCode) {
  const raw = String(rawValue);
  const digits = filterNumericInput(raw);
  const max = maxNationalPhoneDigits(countryCode);

  let message = '';
  if (raw !== digits) {
    message = INPUT_FILTER_MESSAGES.numeric;
  }

  let value = digits;
  if (digits.length > max) {
    value = digits.slice(0, max);
    message = phoneMaxLengthMessage(countryCode);
  }

  return {
    value,
    message,
    rejected: Boolean(message),
  };
}

/** @returns {{ ok: boolean, message: string }} */
export function validateNationalPhone(phone, countryCode) {
  const digits = filterNumericInput(phone);
  if (!digits) {
    return { ok: true, message: '' };
  }
  if (normalizeDialCode(countryCode) === '91') {
    if (digits.length !== 10) {
      return { ok: false, message: INPUT_FILTER_MESSAGES.phoneIndiaLength };
    }
    return { ok: true, message: '' };
  }
  if (digits.length > DEFAULT_NATIONAL_PHONE_MAX) {
    return { ok: false, message: INPUT_FILTER_MESSAGES.phoneOtherLength };
  }
  return { ok: true, message: '' };
}

export function trimPhoneToCountryLimit(phone, countryCode) {
  const digits = filterNumericInput(phone);
  const max = maxNationalPhoneDigits(countryCode);
  if (digits.length <= max) {
    return digits;
  }
  return digits.slice(0, max);
}

export function nationalPhoneHint(countryCode) {
  if (normalizeDialCode(countryCode) === '91') {
    return '10-digit mobile number only (no country code)';
  }
  return `National number without country code (up to ${DEFAULT_NATIONAL_PHONE_MAX} digits)`;
}

export const INPUT_FILTER_MESSAGES_AMOUNT = {
  invalid: 'Only numbers are allowed (up to 2 decimal places).',
  required: 'Daily amount is required.',
  positive: 'Daily amount must be greater than 0.',
};

/** Currency-style amount string: digits with optional decimal (max 2 places). */
export function filterAmountInput(value) {
  let raw = String(value).replace(/[^\d.]/g, '');
  const dotIndex = raw.indexOf('.');
  if (dotIndex !== -1) {
    const whole = raw.slice(0, dotIndex);
    const fraction = raw.slice(dotIndex + 1).replace(/\./g, '').slice(0, 2);
    raw = `${whole}.${fraction}`;
  }
  return raw;
}

export function applyAmountInput(rawValue) {
  const raw = String(rawValue);
  const value = filterAmountInput(raw);
  const rejected = raw !== value;
  return {
    value,
    rejected,
    message: rejected ? INPUT_FILTER_MESSAGES_AMOUNT.invalid : '',
  };
}

/** @returns {{ ok: boolean, value?: number, message: string }} */
export function parseDailyAmountForSubmit(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return { ok: false, message: INPUT_FILTER_MESSAGES_AMOUNT.required };
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num <= 0) {
    return { ok: false, message: INPUT_FILTER_MESSAGES_AMOUNT.positive };
  }
  return { ok: true, value: num, message: '' };
}
