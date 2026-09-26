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
    <div className="flex flex-wrap items-end gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-card">
      <TextField
        id="attendance-range-start"
        label="From"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="min-w-40 flex-1"
      />
      <TextField
        id="attendance-range-end"
        label="To"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="min-w-40 flex-1"
      />
      <Button type="button" onClick={onApply} disabled={loading} className="shrink-0">
        {loading ? 'Loading…' : 'Apply'}
      </Button>
    </div>
  );
}
