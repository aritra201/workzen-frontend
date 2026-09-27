import { useCallback, useEffect, useMemo, useState } from 'react';
import { declareExtraShift, listExtraShifts } from '../../api/extraShifts.js';
import { listEmployeeDropdown } from '../../api/employees.js';
import { todayIsoDate } from '../../utils/format.js';
import ExtraShiftDeclarationsTable, {
  isExtraDeclared,
} from '../../components/admin/ExtraShiftDeclarationsTable.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const DECLARATIONS_PAGE_SIZE = 10;

export default function AdminExtraShiftsPage() {
  const { primaryMembership } = useAuth();
  const companyId = primaryMembership?.companyId;
  const [date, setDate] = useState(todayIsoDate());
  const [employees, setEmployees] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [declarationsPage, setDeclarationsPage] = useState(1);
  const [declarationsTotal, setDeclarationsTotal] = useState(0);
  const [declarationsTotalPages, setDeclarationsTotalPages] = useState(0);
  const [employeeExtraRow, setEmployeeExtraRow] = useState(null);
  const [form, setForm] = useState({ employeeId: '', extraDayShift: true, extraNightShift: false });
  const [pageLoading, setPageLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');

  const applyEmployeeSelection = useCallback((employeeId, row) => {
    if (!row) {
      return;
    }
    const dayDeclared = isExtraDeclared(row.extraDay);
    const nightDeclared = isExtraDeclared(row.extraNight);

    setForm({
      employeeId,
      extraDayShift: dayDeclared ? false : true,
      extraNightShift: nightDeclared ? false : dayDeclared,
    });
  }, []);

  const loadExtraShifts = useCallback(
    async ({ declarationsPage: page = declarationsPage, employeeId = form.employeeId, listOnly = false } = {}) => {
      if (listOnly) {
        setListLoading(true);
      } else {
        setPageLoading(true);
      }
      setError('');
      try {
        const extra = await listExtraShifts({
          date,
          declarationsPage: page,
          declarationsLimit: DECLARATIONS_PAGE_SIZE,
          ...(employeeId ? { employeeId } : {}),
        });
        setDeclarations(extra.declarations || []);
        setDeclarationsTotal(extra.declarationsTotal ?? 0);
        setDeclarationsTotalPages(extra.declarationsTotalPages ?? 0);
        setDeclarationsPage(extra.declarationsPage ?? page);
        setEmployeeExtraRow(extra.employeeRow ?? null);
        return extra;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setListLoading(false);
        setPageLoading(false);
      }
    },
    [date, declarationsPage, form.employeeId]
  );

  const loadEmployees = useCallback(async () => {
    if (!companyId) {
      setEmployees([]);
      return;
    }
    const emp = await listEmployeeDropdown(companyId);
    setEmployees(emp.employees || []);
  }, [companyId]);

  useEffect(() => {
    setDeclarationsPage(1);
    (async () => {
      await loadEmployees();
      await loadExtraShifts({ declarationsPage: 1, employeeId: '' });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- date change
  }, [date]);

  useEffect(() => {
    if (!form.employeeId) {
      setEmployeeExtraRow(null);
      return;
    }
    loadExtraShifts({ employeeId: form.employeeId, declarationsPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- employee selection
  }, [form.employeeId]);

  useEffect(() => {
    if (!form.employeeId || !employeeExtraRow) {
      return;
    }
    if (String(employeeExtraRow.employeeId) !== String(form.employeeId)) {
      return;
    }
    applyEmployeeSelection(form.employeeId, employeeExtraRow);
  }, [applyEmployeeSelection, employeeExtraRow, form.employeeId]);

  const selectedExtraRow = useMemo(() => {
    if (String(employeeExtraRow?.employeeId) === String(form.employeeId)) {
      return employeeExtraRow;
    }
    return null;
  }, [employeeExtraRow, form.employeeId]);

  const dayAlreadyDeclared = isExtraDeclared(selectedExtraRow?.extraDay);
  const nightAlreadyDeclared = isExtraDeclared(selectedExtraRow?.extraNight);

  const extraDayChecked = dayAlreadyDeclared ? false : form.extraDayShift;
  const extraNightChecked = nightAlreadyDeclared ? false : form.extraNightShift;

  const canDeclareDay = form.employeeId && !dayAlreadyDeclared;
  const canDeclareNight = form.employeeId && !nightAlreadyDeclared;
  const canSubmit =
    form.employeeId && ((canDeclareDay && extraDayChecked) || (canDeclareNight && extraNightChecked));

  function handleEmployeeChange(employeeId) {
    setForm((prev) => ({
      ...prev,
      employeeId,
      extraDayShift: true,
      extraNightShift: false,
    }));
  }

  function goToDeclarationsPage(nextPage) {
    setDeclarationsPage(nextPage);
    loadExtraShifts({
      declarationsPage: nextPage,
      employeeId: form.employeeId,
      listOnly: true,
    });
  }

  async function handleDeclare(event) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    try {
      await declareExtraShift({
        employeeId: form.employeeId,
        date,
        extraDayShift: canDeclareDay && extraDayChecked,
        extraNightShift: canDeclareNight && extraNightChecked,
      });
      await loadExtraShifts({ employeeId: form.employeeId, declarationsPage, listOnly: true });
    } catch (err) {
      setError(err.message);
    }
  }

  const rangeStart =
    declarationsTotal === 0 ? 0 : (declarationsPage - 1) * DECLARATIONS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(declarationsPage * DECLARATIONS_PAGE_SIZE, declarationsTotal);
  const showDeclarationsPagination =
    declarationsTotalPages > 1 || declarationsTotal > DECLARATIONS_PAGE_SIZE;

  if (pageLoading && !declarations.length && !employees.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Extra shifts</h1>
      <ErrorMessage message={error} />

      <form
        onSubmit={handleDeclare}
        className="grid gap-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-card md:grid-cols-2"
      >
        <TextField id="extra-date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Employee</span>
          <select
            className="h-12 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3"
            value={form.employeeId}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            required
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
            ))}
          </select>
        </label>
        <label className={`flex items-center gap-2 text-sm ${dayAlreadyDeclared ? 'opacity-50' : ''}`}>
          <input
            type="checkbox"
            checked={extraDayChecked}
            disabled={!canDeclareDay}
            onChange={(ev) => setForm({ ...form, extraDayShift: ev.target.checked })}
          />
          Extra day shift
          {dayAlreadyDeclared ? (
            <span className="text-xs text-on-surface-variant">(already declared)</span>
          ) : null}
        </label>
        <label className={`flex items-center gap-2 text-sm ${nightAlreadyDeclared ? 'opacity-50' : ''}`}>
          <input
            type="checkbox"
            checked={extraNightChecked}
            disabled={!canDeclareNight}
            onChange={(ev) => setForm({ ...form, extraNightShift: ev.target.checked })}
          />
          Extra night shift
          {nightAlreadyDeclared ? (
            <span className="text-xs text-on-surface-variant">(already declared)</span>
          ) : null}
        </label>
        <Button type="submit" className="md:col-span-2" disabled={!canSubmit}>
          Declare extra shift
        </Button>
      </form>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Declarations for {date}</h2>
            <p className="text-sm text-on-surface-variant">
              {declarationsTotal === 0
                ? 'No extra shifts declared for this date.'
                : `Showing ${rangeStart}–${rangeEnd} of ${declarationsTotal}`}
            </p>
          </div>
          {listLoading ? (
            <span className="text-xs text-on-surface-variant">Updating…</span>
          ) : null}
        </div>

        <div className={listLoading ? 'pointer-events-none opacity-60' : ''}>
          <ExtraShiftDeclarationsTable
            rows={declarations}
            date={date}
            emptyMessage="No declarations yet for this date."
          />
        </div>

        {showDeclarationsPagination ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={declarationsPage <= 1 || listLoading}
              onClick={() => goToDeclarationsPage(declarationsPage - 1)}
            >
              Previous
            </Button>
            <span className="text-on-surface-variant">
              Page {declarationsPage} of {Math.max(declarationsTotalPages, 1)}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={declarationsPage >= declarationsTotalPages || listLoading}
              onClick={() => goToDeclarationsPage(declarationsPage + 1)}
            >
              Next
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
