import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { listEmployeeDropdownOptions } from '../../api/employees.js';
import { useAuth } from '../../hooks/useAuth.js';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Icon from '../ui/Icon.jsx';

function employeeMatchesSearch(emp, query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    String(emp.employeeName || '').toLowerCase().includes(q) ||
    String(emp.employeeEmail || '').toLowerCase().includes(q)
  );
}

function selectionSummary(options, value, mode) {
  const ids = value.map(String);
  if (!ids.length) {
    return mode === 'single' ? 'All employees' : 'All employees';
  }
  const selected = options.filter((o) => ids.includes(String(o.employeeId)));
  if (mode === 'single' && selected[0]) {
    return selected[0].employeeName;
  }
  if (selected.length === 1) {
    return selected[0].employeeName;
  }
  return `${selected.length} employees selected`;
}

/**
 * Searchable employee dropdown (scales to 100+ rows).
 * @param {'single' | 'multiple'} mode
 * @param {string[]} value — selected employee ids
 */
export default function EmployeeFilterSelect({
  mode = 'multiple',
  value = [],
  onChange,
  label = 'Employees',
  className = '',
  disabled,
  placeholder = 'Search name or email…',
  emptyLabel = 'All employees',
  triggerPlaceholder = 'All employees',
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { primaryMembership } = useAuth();
  const companyId = primaryMembership?.companyId;

  useEffect(() => {
    let cancelled = false;
    if (!companyId) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    listEmployeeDropdownOptions(companyId)
      .then((data) => {
        if (!cancelled) {
          setOptions(data.employees || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

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

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered = useMemo(
    () => options.filter((emp) => employeeMatchesSearch(emp, search)),
    [options, search]
  );

  const selectedSet = useMemo(() => new Set(value.map(String)), [value]);
  const summary = loading
    ? 'Loading…'
    : value.length
      ? selectionSummary(options, value, mode)
      : triggerPlaceholder;

  function toggleId(id) {
    const sid = String(id);
    if (mode === 'single') {
      onChange([sid]);
      setOpen(false);
      setSearch('');
      return;
    }
    if (selectedSet.has(sid)) {
      onChange(value.map(String).filter((v) => v !== sid));
    } else {
      onChange([...value.map(String), sid]);
    }
  }

  function selectAll() {
    onChange([]);
    if (mode === 'single') {
      setOpen(false);
      setSearch('');
    }
  }

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-on-surface">{label}</span>
      ) : null}
      <button
        type="button"
        disabled={disabled || loading}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-12 w-full items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 text-left text-sm transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="min-w-0 flex-1 truncate text-on-surface">{summary}</span>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={22} className="shrink-0 text-on-surface-variant" />
      </button>

      {open ? (
        <div
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-lg"
          role="listbox"
          id={listId}
          aria-multiselectable={mode === 'multiple'}
        >
          <div className="border-b border-outline-variant/30 p-2">
            <div className="flex items-center gap-2 rounded-md bg-surface-container-low px-2">
              <Icon name="search" size={18} className="text-on-surface-variant" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="h-9 w-full bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none md:text-sm"
                autoComplete="off"
              />
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                role="option"
                aria-selected={value.length === 0}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-container-high ${
                  value.length === 0 ? 'bg-primary/10 font-medium text-primary' : ''
                }`}
                onClick={selectAll}
              >
                {emptyLabel}
              </button>
            </li>
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-center text-xs text-on-surface-variant">No matches.</li>
            ) : (
              filtered.map((emp) => {
                const id = String(emp.employeeId);
                const selected = selectedSet.has(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-surface-container-high ${
                        selected ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => toggleId(id)}
                    >
                      {mode === 'multiple' ? (
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-outline-variant bg-surface-container-lowest'
                          }`}
                        >
                          {selected ? <Icon name="check" size={14} /> : null}
                        </span>
                      ) : null}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{emp.employeeName}</span>
                        <span className="block truncate text-xs text-on-surface-variant">
                          {emp.employeeEmail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {mode === 'multiple' ? (
            <div className="flex items-center justify-between gap-2 border-t border-outline-variant/30 px-3 py-2">
              <button
                type="button"
                className="text-xs font-semibold text-primary disabled:opacity-50"
                disabled={!value.length}
                onClick={() => onChange([])}
              >
                Clear all
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary"
                onClick={() => {
                  setOpen(false);
                  setSearch('');
                }}
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ErrorMessage message={error} />
    </div>
  );
}
