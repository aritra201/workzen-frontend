import Button from '../ui/Button.jsx';
import TextField from '../ui/TextField.jsx';
import MarkedAttendanceOnlyField from './MarkedAttendanceOnlyField.jsx';

export default function AttendanceDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onReset,
  markedAttendanceOnly,
  onMarkedAttendanceOnlyChange,
  showMarkedAttendanceOnly = false,
  loading,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-end">
      <TextField
        id="attendance-range-start"
        label="From"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="min-w-0 w-full flex-1 sm:min-w-40"
      />
      <TextField
        id="attendance-range-end"
        label="To"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="min-w-0 w-full flex-1 sm:min-w-40"
      />
      {showMarkedAttendanceOnly ? (
        <MarkedAttendanceOnlyField
          checked={Boolean(markedAttendanceOnly)}
          onChange={onMarkedAttendanceOnlyChange}
          disabled={loading}
          className="w-full sm:flex-1 sm:min-w-[12rem]"
        />
      ) : null}
      <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:w-auto">
        {onReset ? (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={loading}
            className="h-12 w-full px-6 sm:w-auto"
          >
            Reset
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="h-12 w-full px-8 sm:w-auto"
        >
          {loading ? 'Loading…' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
