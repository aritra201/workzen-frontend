import { useState } from 'react';
import Icon from './Icon.jsx';
import {
  applyAmountInput,
  applyInputFilter,
  applyPhoneNationalInput,
} from '../../utils/inputFilters.js';

const DATE_FIELD_TYPES = new Set(['date', 'datetime-local', 'month', 'time', 'week']);

function DateFieldCalendarIcon() {
  return (
    <Icon
      name="calendar_month"
      size={20}
      className="pointer-events-none absolute right-3.5 top-1/2 z-[1] -translate-y-1/2 text-on-surface-variant"
      aria-hidden
    />
  );
}

function PasswordVisibilityToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 z-[2] -translate-y-1/2 rounded p-1 text-on-surface-variant hover:text-on-surface"
      aria-label={visible ? 'Hide password' : 'Show password'}
      onClick={onToggle}
    >
      <Icon name={visible ? 'visibility' : 'visibility_off'} size={20} />
    </button>
  );
}

export default function TextField({
  label,
  id,
  icon,
  hint,
  error,
  className = '',
  inputClassName = '',
  suffix,
  type,
  inputFilter,
  phoneCountryCode,
  onChange,
  ...inputProps
}) {
  const isPasswordField = type === 'password';
  const isDateField = DATE_FIELD_TYPES.has(type);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [filterError, setFilterError] = useState('');
  const resolvedType = isPasswordField ? (passwordVisible ? 'text' : 'password') : type;
  const resolvedSuffix =
    suffix ??
    (isPasswordField
      ? (
          <PasswordVisibilityToggle
            visible={passwordVisible}
            onToggle={() => setPasswordVisible((v) => !v)}
          />
        )
      : isDateField
        ? <DateFieldCalendarIcon />
        : null);
  const trailingAffordance = Boolean(resolvedSuffix);
  const horizontalPadding = icon
    ? `pl-11 ${trailingAffordance ? 'pr-11' : 'pr-4'}`
    : `pl-4 ${trailingAffordance ? 'pr-11' : 'pr-4'}`;
  const displayError = error || filterError;

  function handleChange(event) {
    if (!onChange) return;

    if (inputFilter === 'phone') {
      const { value, message } = applyPhoneNationalInput(event.target.value, phoneCountryCode);
      setFilterError(message);
      onChange({
        ...event,
        target: { ...event.target, value },
        currentTarget: { ...event.currentTarget, value },
      });
      return;
    }

    if (inputFilter === 'amount') {
      const { value, message } = applyAmountInput(event.target.value);
      setFilterError(message);
      onChange({
        ...event,
        target: { ...event.target, value },
        currentTarget: { ...event.currentTarget, value },
      });
      return;
    }

    if (inputFilter === 'alphabetic' || inputFilter === 'numeric') {
      const { value, message } = applyInputFilter(inputFilter, event.target.value);
      setFilterError(message);
      onChange({
        ...event,
        target: { ...event.target, value },
        currentTarget: { ...event.currentTarget, value },
      });
      return;
    }

    setFilterError('');
    onChange(event);
  }

  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-on-surface">{label}</span>
      ) : null}
      <div className="relative flex items-center">
        {icon ? (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 z-[1] text-on-surface-variant"
            size={20}
          />
        ) : null}
        <input
          id={id}
          className={`h-12 w-full max-w-full rounded-lg border text-base text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none transition-all md:text-sm ${displayError ? 'border-error focus:shadow-[0_0_0_2px_#ba1a1a]' : 'border-outline-variant/40 focus:shadow-[0_0_0_2px_#00685f]'} bg-surface-container-lowest ${horizontalPadding} ${isDateField ? 'date-field-input relative' : ''} ${inputClassName}`}
          type={resolvedType}
          onChange={handleChange}
          {...inputProps}
        />
        {resolvedSuffix}
      </div>
      {displayError ? <p className="mt-1 text-xs text-error">{displayError}</p> : null}
      {hint && !displayError ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </label>
  );
}
