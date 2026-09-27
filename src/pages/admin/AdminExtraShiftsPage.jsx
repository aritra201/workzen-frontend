import { useCallback, useEffect, useMemo, useState } from 'react';
import { declareExtraShift, listExtraShifts } from '../../api/extraShifts.js';
import { employeeIdsQueryParam } from '../../utils/employeeIds.js';
import { todayIsoDate } from '../../utils/format.js';
import ExtraShiftDeclarationsTable, {
  isExtraDeclared,
} from '../../components/admin/ExtraShiftDeclarationsTable.jsx';
import EmployeeFilterSelect from '../../components/admin/EmployeeFilterSelect.jsx';
import ListPagination from '../../components/common/ListPagination.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ExtraShiftDeclareConfirmModal from '../../components/admin/ExtraShiftDeclareConfirmModal.jsx';

const DECLARATIONS_PAGE_SIZE = 10;

export default function AdminExtraShiftsPage() {
  const [date, setDate] = useState(todayIsoDate());
  const [declarations, setDeclarations] = useState([]);
  const [declarationsPage, setDeclarationsPage] = useState(1);
  const [declarationsTotal, setDeclarationsTotal] = useState(0);
  const [declarationsTotalPages, setDeclarationsTotalPages] = useState(0);
  const [listFilterEmployeeIds, setListFilterEmployeeIds] = useState([]);
  const [employeeExtraRow, setEmployeeExtraRow] = useState(null);
  const [form, setForm] = useState({ employeeId: '', extraDayShift: true, extraNightShift: false });
  const [pageLoading, setPageLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [declareConfirmOpen, setDeclareConfirmOpen] = useState(false);
  const [declareBusy, setDeclareBusy] = useState(false);

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
    async ({
      declarationsPage: page = declarationsPage,
      employeeId = form.employeeId,
      declarationsEmployeeId = listFilterEmployeeIds,
      listOnly = false,
    } = {}) => {
      if (listOnly) {
        setListLoading(true);
      } else {
        setPageLoading(true);
      }
      setError('');
      try {
        const declFilter = employeeIdsQueryParam(declarationsEmployeeId);
        const extra = await listExtraShifts({
          date,
          declarationsPage: page,
          declarationsLimit: DECLARATIONS_PAGE_SIZE,
          ...(employeeId ? { employeeId } : {}),
          ...(declFilter ? { declarationsEmployeeId: declFilter } : {}),
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
    [date, declarationsPage, form.employeeId, listFilterEmployeeIds]
  );

  useEffect(() => {
    setDeclarationsPage(1);
    setListFilterEmployeeIds([]);
    loadExtraShifts({ declarationsPage: 1, employeeId: '', declarationsEmployeeId: [], listOnly: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- date change
  }, [date]);

  useEffect(() => {
    if (!form.employeeId) {
      setEmployeeExtraRow(null);
      return;
    }
    loadExtraShifts({ employeeId: form.employeeId, declarationsPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- declare form employee
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

  function handleDeclareEmployeeChange(ids) {
    const employeeId = ids[0] || '';
    setForm((prev) => ({
      ...prev,
      employeeId,
      extraDayShift: true,
      extraNightShift: false,
    }));
  }

  function handleApplyListFilter() {
    setDeclarationsPage(1);
    loadExtraShifts({
      declarationsPage: 1,
      declarationsEmployeeId: listFilterEmployeeIds,
      listOnly: true,
    });
  }

  function handlePageChange(nextPage) {
    setDeclarationsPage(nextPage);
    loadExtraShifts({
      declarationsPage: nextPage,
      declarationsEmployeeId: listFilterEmployeeIds,
      listOnly: true,
    });
  }

  const shiftsToDeclare = useMemo(() => {
    const labels = [];
    if (canDeclareDay && extraDayChecked) {
      labels.push('Extra day shift');
    }
    if (canDeclareNight && extraNightChecked) {
      labels.push('Extra night shift');
    }
    return labels;
  }, [canDeclareDay, canDeclareNight, extraDayChecked, extraNightChecked]);

  function handleDeclare(event) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setDeclareConfirmOpen(true);
  }

  async function confirmDeclare() {
    if (!canSubmit) {
      return;
    }
    setDeclareBusy(true);
    setError('');
    try {
      await declareExtraShift({
        employeeId: form.employeeId,
        date,
        extraDayShift: canDeclareDay && extraDayChecked,
        extraNightShift: canDeclareNight && extraNightChecked,
      });
      setDeclareConfirmOpen(false);
      await loadExtraShifts({
        employeeId: form.employeeId,
        declarationsPage,
        declarationsEmployeeId: listFilterEmployeeIds,
        listOnly: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setDeclareBusy(false);
    }
  }

  const rangeStart =
    declarationsTotal === 0 ? 0 : (declarationsPage - 1) * DECLARATIONS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(declarationsPage * DECLARATIONS_PAGE_SIZE, declarationsTotal);

  if (pageLoading && !declarations.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Extra shifts</h1>
      <ErrorMessage message={error} />

      <form
        onSubmit={handleDeclare}
        className="space-y-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            id="extra-date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <EmployeeFilterSelect
            mode="single"
            label="Employee"
            value={form.employeeId ? [form.employeeId] : []}
            onChange={handleDeclareEmployeeChange}
            emptyLabel="Select employee"
            triggerPlaceholder="Select employee"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-3 border-t border-outline-variant/30 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <label className={`flex items-center gap-2 text-sm ${dayAlreadyDeclared ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                checked={extraDayChecked}
                disabled={!canDeclareDay}
                onChange={(ev) => setForm({ ...form, extraDayShift: ev.target.checked })}
              />
              Extra day shift
              {dayAlreadyDeclared ? (
                <span className="text-xs text-on-surface-variant">(declared)</span>
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
                <span className="text-xs text-on-surface-variant">(declared)</span>
              ) : null}
            </label>
          </div>
          <Button type="submit" className="h-10 shrink-0 px-6 sm:w-auto" disabled={!canSubmit}>
            Declare extra shift
          </Button>
        </div>
      </form>

      <ExtraShiftDeclareConfirmModal
        open={declareConfirmOpen}
        employeeName={selectedExtraRow?.employeeName}
        date={date}
        shiftLabels={shiftsToDeclare}
        loading={declareBusy}
        onCancel={() => !declareBusy && setDeclareConfirmOpen(false)}
        onConfirm={confirmDeclare}
      />

      <section className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
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

        <div className="flex flex-col gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-3 shadow-card sm:flex-row sm:items-end sm:gap-3">
          <EmployeeFilterSelect
            mode="multiple"
            label="Filter declarations"
            value={listFilterEmployeeIds}
            onChange={setListFilterEmployeeIds}
            className="min-w-0 flex-1 sm:max-w-sm"
            disabled={listLoading}
          />
          <Button
            type="button"
            onClick={handleApplyListFilter}
            disabled={listLoading}
            className="h-10 w-full shrink-0 px-6 sm:w-auto"
          >
            Apply filter
          </Button>
        </div>

        <div className={listLoading ? 'pointer-events-none opacity-60' : ''}>
          <ExtraShiftDeclarationsTable
            rows={declarations}
            date={date}
            emptyMessage="No declarations yet for this date."
          />
        </div>

        <ListPagination
          page={declarationsPage}
          totalPages={declarationsTotalPages}
          total={declarationsTotal}
          pageSize={DECLARATIONS_PAGE_SIZE}
          loading={listLoading}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}
