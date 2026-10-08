import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPayroll } from '../../api/payroll.js';
import {
  getAttendanceEmployeeName,
  getAttendanceEmployeeProfilePicture,
} from '../../utils/companyAttendanceList.js';
import { listRangeLastDays } from '../../utils/myAttendanceList.js';
import { employeeIdsQueryParam } from '../../utils/employeeIds.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import CompanyAttendanceFilters from '../../components/attendance/CompanyAttendanceFilters.jsx';
import PayrollShiftAmountList from '../../components/payroll/PayrollShiftAmountList.jsx';
import ListPagination from '../../components/common/ListPagination.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import TableCard from '../../components/common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../../components/common/MobileList.jsx';

const DEFAULT_RANGE_DAYS = 30;
const PAGE_SIZE = 20;

export default function CompanyPayrollPage({ title, detailBasePath, readOnly }) {
  const initialRange = listRangeLastDays(DEFAULT_RANGE_DAYS);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async ({ from, to, pageNum = page, employees = employeeIds } = {}) => {
      setLoading(true);
      setError('');
      try {
        const params = {
          startDate: from ?? startDate,
          endDate: to ?? endDate,
          limit: PAGE_SIZE,
          page: pageNum,
        };
        const employeeIdParam = employeeIdsQueryParam(employees);
        if (employeeIdParam) {
          params.employeeId = employeeIdParam;
        }
        const data = await listPayroll(params);
        setRecords(data.items || []);
        setSummary(data.summary || null);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 0);
        setPage(data.page ?? pageNum);
      } catch (err) {
        setError(err.message);
        setRecords([]);
        setSummary(null);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate, page, employeeIds]
  );

  useEffect(() => {
    load({ pageNum: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
  }, []);

  function handleApply() {
    setPage(1);
    load({ from: startDate, to: endDate, pageNum: 1, employees: employeeIds });
  }

  function handleReset() {
    const range = listRangeLastDays(DEFAULT_RANGE_DAYS);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setEmployeeIds([]);
    setPage(1);
    load({
      from: range.startDate,
      to: range.endDate,
      pageNum: 1,
      employees: [],
    });
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    load({ pageNum: nextPage, employees: employeeIds });
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  if (loading && records.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-on-surface-variant">
          {readOnly ? 'View-only' : 'Payroll'} from confirmed shifts only — default last{' '}
          {DEFAULT_RANGE_DAYS} days. Filter by date and employee.
        </p>
      </div>

      <CompanyAttendanceFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        employeeIds={employeeIds}
        onEmployeeIdsChange={setEmployeeIds}
        onApply={handleApply}
        onReset={handleReset}
        loading={loading}
      />

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 shadow-card sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Total (filtered range)
            </p>
            <p className="label-numeric mt-1 text-2xl font-bold text-on-surface">
              {summary.grandTotal != null ? formatCurrencyInr(summary.grandTotal) : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Marked days
            </p>
            <p className="mt-1 text-2xl font-bold text-on-surface">{summary.recordCount ?? 0}</p>
          </div>
          <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Confirmed shifts
            </p>
            <p className="mt-1 text-2xl font-bold text-on-surface">
              {summary.markedShiftCount ?? 0}
            </p>
          </div>
        </div>
      ) : null}

      <ErrorMessage message={error} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-on-surface-variant">
        <span>
          {total === 0
            ? 'No marked attendance in this range.'
            : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
        </span>
        {loading ? <span className="text-xs">Updating…</span> : null}
      </div>

      {records.length === 0 ? (
        <p className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
          No payroll rows for this filter. Only days with at least one confirmed shift appear here.
        </p>
      ) : (
        <MobileListStack className={loading ? 'opacity-60' : ''}>
          {records.map((row) => {
            const employeeName = getAttendanceEmployeeName(row);
            return (
              <MobileListCard key={row.attendanceId}>
                <div className="flex items-center gap-3">
                  <PersonAvatar
                    name={employeeName}
                    email={row.employee?.email}
                    src={getAttendanceEmployeeProfilePicture(row)}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{employeeName}</p>
                    <p className="text-sm text-on-surface-variant">{formatDateLabel(row.date)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <PayrollShiftAmountList shifts={row.shifts} />
                </div>
                <p className="label-numeric mt-3 text-base font-semibold text-on-surface">
                  Day total:{' '}
                  {row.dayTotal != null ? formatCurrencyInr(row.dayTotal) : '—'}
                </p>
                <Link
                  className="mt-4 inline-flex h-10 items-center font-semibold text-primary"
                  to={`${detailBasePath}?attendanceId=${row.attendanceId}`}
                >
                  View detail
                </Link>
              </MobileListCard>
            );
          })}
        </MobileListStack>
      )}

      {records.length > 0 ? (
        <TableCard
          className={`rounded-lg ${loading ? 'opacity-60' : ''}`}
          minTableWidth="md:min-w-[44rem]"
        >
          <thead className="border-b border-outline-variant/40 bg-surface-container-low">
            <tr>
              <th className="label-caps px-3 py-2 text-outline">Employee</th>
              <th className="label-caps px-3 py-2 text-outline">Date</th>
              <th className="label-caps px-3 py-2 text-outline md:min-w-[12rem]">Shifts</th>
              <th className="label-caps px-3 py-2 text-outline">Day total</th>
              <th className="label-caps px-3 py-2 text-right text-outline">Detail</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => {
              const employeeName = getAttendanceEmployeeName(row);
              return (
                <tr
                  key={row.attendanceId}
                  className="border-t border-outline-variant/30 hover:bg-surface-container-high/50"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        name={employeeName}
                        email={row.employee?.email}
                        src={getAttendanceEmployeeProfilePicture(row)}
                        size={36}
                      />
                      <span className="font-medium">{employeeName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">{formatDateLabel(row.date)}</td>
                  <td className="px-3 py-2">
                    <PayrollShiftAmountList shifts={row.shifts} />
                  </td>
                  <td className="label-numeric px-3 py-2 font-semibold text-on-surface">
                    {row.dayTotal != null ? formatCurrencyInr(row.dayTotal) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      className="font-semibold text-primary"
                      to={`${detailBasePath}?attendanceId=${row.attendanceId}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableCard>
      ) : null}

      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
