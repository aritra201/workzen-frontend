import { shiftChipClassName } from '../../utils/shiftChipStyles.js';
import { formatCurrencyInr } from '../../utils/format.js';

export default function PayrollShiftAmountList({ shifts, className = '' }) {
  if (!shifts?.length) {
    return <span className="text-sm text-on-surface-variant">—</span>;
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {shifts.map((line) => (
        <div key={line.shiftKey} className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex min-w-[5.5rem] shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${shiftChipClassName(line.shiftKey)}`}
          >
            {line.shiftLabel}
          </span>
          <span className="label-numeric text-sm font-medium text-on-surface">
            {line.amount != null ? formatCurrencyInr(line.amount) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}
