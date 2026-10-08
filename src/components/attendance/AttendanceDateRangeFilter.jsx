import Button from '../ui/Button.jsx';
import TextField from '../ui/TextField.jsx';

export default function AttendanceDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  loading,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-end">
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
      <Button type="button" onClick={onApply} disabled={loading} className="h-12 w-full shrink-0 sm:w-auto">
        {loading ? 'Loading…' : 'Apply'}
      </Button>
    </div>
  );
}
