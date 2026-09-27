import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanyAttendance } from '../../api/companyAttendance.js';
import {
  getAttendanceEmployeeName,
  getAttendanceEmployeeProfilePicture,
  getCompanyAttendanceListItems,
  sumShiftAmounts,
} from '../../utils/companyAttendanceList.js';
import { listRangeLastDays } from '../../utils/myAttendanceList.js';
import { employeeIdsQueryParam } from '../../utils/employeeIds.js';
import CompanyAttendanceFilters from '../../components/attendance/CompanyAttendanceFilters.jsx';
import ListPagination from '../../components/common/ListPagination.jsx';
import AttendanceShiftStatusPairs from '../../components/attendance/AttendanceShiftStatusPairs.jsx';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import TableCard from '../../components/common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../../components/common/MobileList.jsx';

const DEFAULT_RANGE_DAYS = 30;
const PAGE_SIZE = 20;

export default function CompanyAttendanceListPage({
  title,
  detailBasePath,
  statusFilter,
  readOnly,
}) {
  const initialRange = listRangeLastDays(DEFAULT_RANGE_DAYS);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
          fresh: true,
        };
        if (statusFilter) {
          params.status = statusFilter;
        }
        const employeeIdParam = employeeIdsQueryParam(employees);
        if (employeeIdParam) {
          params.employeeId = employeeIdParam;
        }
        const data = await listCompanyAttendance(params);
        setRecords(getCompanyAttendanceListItems(data));
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 0);
        setPage(data.page ?? pageNum);
      } catch (err) {
        setError(err.message);
        setRecords([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate, statusFilter, page, employeeIds]
  );

  useEffect(() => {
    load({ pageNum: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when status tab changes
  }, [statusFilter]);

  function handleApply() {
    setPage(1);
    load({ from: startDate, to: endDate, pageNum: 1, employees: employeeIds });
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
        {readOnly ? (
          <p className="text-sm text-on-surface-variant">View-only member access</p>
        ) : (
          <p className="text-sm text-on-surface-variant">
            Filter by date range (default: last {DEFAULT_RANGE_DAYS} days) and employee.
          </p>
        )}
      </div>

      <CompanyAttendanceFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        employeeIds={employeeIds}
        onEmployeeIdsChange={setEmployeeIds}
        onApply={handleApply}
        loading={loading}
      />

      <ErrorMessage message={error} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-on-surface-variant">
        <span>
          {total === 0
            ? 'No records in this range.'
            : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
        </span>
        {loading ? <span className="text-xs">Updating…</span> : null}
      </div>

      {records.length === 0 ? (
        <p className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
          No attendance records for this date range.
        </p>
      ) : (
        <MobileListStack className={loading ? 'opacity-60' : ''}>
          {records.map((row) => {
            const totalAmount = sumShiftAmounts(row.shifts);
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
                  <p className="label-caps mb-1 text-outline">Shifts</p>
                  <AttendanceShiftStatusPairs shifts={row.shifts} />
                </div>
                <p className="mt-3 label-numeric text-on-surface">
                  {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
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
        minTableWidth="md:min-w-[52rem]"
      >
          <thead className="border-b border-outline-variant/40 bg-surface-container-low">
            <tr>
              <th className="label-caps px-3 py-2 text-outline">Employee</th>
              <th className="label-caps px-3 py-2 text-outline">Date</th>
              <th className="label-caps px-3 py-2 text-outline md:min-w-[14rem]">
                <span className="grid grid-cols-[minmax(5.5rem,7rem)_minmax(0,1fr)] gap-x-4">
                  <span>Shift</span>
                  <span>Status</span>
                </span>
              </th>
              <th className="label-caps px-3 py-2 text-outline">Amount</th>
              <th className="label-caps px-3 py-2 text-right text-outline">Detail</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => {
                const totalAmount = sumShiftAmounts(row.shifts);
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
                      <AttendanceShiftStatusPairs shifts={row.shifts} />
                    </td>
                    <td className="label-numeric px-3 py-2 text-on-surface">
                      {totalAmount != null ? formatCurrencyInr(totalAmount) : 'N/A'}
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
