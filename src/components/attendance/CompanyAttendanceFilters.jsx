import Button from '../ui/Button.jsx';
import TextField from '../ui/TextField.jsx';
import EmployeeFilterSelect from '../admin/EmployeeFilterSelect.jsx';
import MarkedAttendanceOnlyField from './MarkedAttendanceOnlyField.jsx';

export default function CompanyAttendanceFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  employeeIds,
  onEmployeeIdsChange,
  onApply,
  onReset,
  markedAttendanceOnly,
  onMarkedAttendanceOnlyChange,
  loading,
}) {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
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
        <EmployeeFilterSelect
          mode="multiple"
          label="Employees"
          value={employeeIds}
          onChange={onEmployeeIdsChange}
          disabled={loading}
          className="min-w-0 w-full flex-1 lg:max-w-sm"
        />
        <MarkedAttendanceOnlyField
          checked={Boolean(markedAttendanceOnly)}
          onChange={onMarkedAttendanceOnlyChange}
          disabled={loading}
          className="w-full lg:w-auto lg:self-end"
        />
        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
          {onReset ? (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={loading}
              className="h-12 w-full px-6 sm:flex-1 lg:w-auto"
            >
              Reset
            </Button>
          ) : null}
          <Button
            type="button"
            onClick={onApply}
            disabled={loading}
            className="h-12 w-full px-8 sm:flex-1 lg:w-auto"
          >
            {loading ? 'Loading…' : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  );
}
