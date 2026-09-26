import { useRef } from 'react';

export default function OtpInput({ value, onChange, length = 4, disabled }) {
  const inputsRef = useRef([]);

  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  function focusIndex(index) {
    inputsRef.current[index]?.focus();
  }

  function handleChange(index, char) {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d === ' ' ? '' : d));
    onChange(next.join('').replace(/\s/g, ''));
    if (digit && index < length - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      focusIndex(index - 1);
    }
  }

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digit.trim()}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="h-14 w-12 rounded-xl border border-surface-container-high bg-surface-container-lowest text-center text-xl font-bold text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      ))}
    </div>
  );
}
