import { useEffect, useMemo, useRef, useState } from 'react';

function defaultLabel(option, valueKey) {
  if (valueKey === 'countryName') {
    return option.countryName;
  }
  return `${option.dialCode} ${option.countryName}`;
}

export default function CountrySearchCombobox({
  id,
  label,
  value,
  valueKey = 'dialCode',
  options,
  onChange,
  placeholder = 'Search country',
  error,
  className = '',
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((o) => o[valueKey] === value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return options;
    }
    return options.filter(
      (c) =>
        c.countryName.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.isoCode.toLowerCase().includes(q)
    );
  }, [options, search]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  function handleSelect(option) {
    onChange(option);
    setOpen(false);
    setSearch('');
  }

  const displayValue = open ? search : selected ? defaultLabel(selected, valueKey) : value || '';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="block" htmlFor={id}>
        {label ? (
          <span className="mb-1.5 block text-xs font-medium text-on-surface">{label}</span>
        ) : null}
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          className="h-12 w-full rounded-lg bg-surface-container-low px-4 text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#00685f] focus:outline-none"
          value={displayValue}
          onFocus={() => {
            setOpen(true);
            setSearch('');
          }}
          onChange={(e) => {
            setOpen(true);
            setSearch(e.target.value);
          }}
        />
      </label>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}

      {open ? (
        <ul
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-1 shadow-card"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm text-on-surface-variant">No matches</li>
          ) : (
            filtered.map((option) => (
              <li key={`${option.isoCode}-${option.dialCode}-${option.id}`} role="option">
                <button
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-container-low ${
                    option[valueKey] === value ? 'bg-primary/10 font-medium text-primary' : 'text-on-surface'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option)}
                >
                  {defaultLabel(option, valueKey)}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
