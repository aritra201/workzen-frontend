import { useCallback, useEffect, useState } from 'react';
import { inviteEmployee, listEmployees, resendEmployeeInvite, updateEmployeeStatus } from '../../api/employees.js';
import { employeeIdsQueryParam } from '../../utils/employeeIds.js';
import EmployeeFilterSelect from '../../components/admin/EmployeeFilterSelect.jsx';
import ListPagination from '../../components/common/ListPagination.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import Modal, { ModalActions } from '../../components/ui/Modal.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChangeConfirmModal from '../../components/admin/StatusChangeConfirmModal.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TableCard from '../../components/common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../../components/common/MobileList.jsx';

const PAGE_SIZE = 20;

function employeeStatus(employee) {
  if (!employee.userId) {
    return { label: 'Invitation pending', tone: 'pending' };
  }
  if (employee.isActive) {
    return { label: 'Active', tone: 'verified' };
  }
  return { label: 'Inactive', tone: 'locked' };
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filterEmployeeIds, setFilterEmployeeIds] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState({ employeeName: '', employeeEmail: '' });
  const [busy, setBusy] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(null);

  const load = useCallback(
    async (pageNum = page, selectedIds = filterEmployeeIds) => {
      setLoading(true);
      setError('');
      try {
        const params = { page: pageNum, limit: PAGE_SIZE };
        const employeeId = employeeIdsQueryParam(selectedIds);
        if (employeeId) {
          params.employeeId = employeeId;
        }
        const data = await listEmployees(params);
        setEmployees(data.items || data.employees || []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 0);
        setPage(data.page ?? pageNum);
      } catch (err) {
        setError(err.message);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    },
    [page, filterEmployeeIds]
  );

  useEffect(() => {
    load(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
  }, []);

  function handleApplyFilter() {
    setPage(1);
    load(1, filterEmployeeIds);
  }

  async function handleInvite() {
    setBusy(true);
    setError('');
    try {
      await inviteEmployee(form);
      setInviteOpen(false);
      setForm({ employeeName: '', employeeEmail: '' });
      await load(page, filterEmployeeIds);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResend(employee) {
    setError('');
    try {
      await resendEmployeeInvite({ employeeEmail: employee.employeeEmail });
      await load(page, filterEmployeeIds);
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyStatusChange() {
    if (!statusConfirm) return;
    const { employee, nextActive } = statusConfirm;
    setBusy(true);
    setError('');
    try {
      await updateEmployeeStatus(employee.employeeId, { isActive: nextActive });
      setStatusConfirm(null);
      await load(page, filterEmployeeIds);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  if (loading && employees.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Employees & labour</h1>
        <Button onClick={() => setInviteOpen(true)}>Invite employee</Button>
      </div>
      <ErrorMessage message={error} />

      <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-end">
        <EmployeeFilterSelect
          mode="multiple"
          label="Filter by employee"
          value={filterEmployeeIds}
          onChange={setFilterEmployeeIds}
          className="min-w-0 w-full flex-1 sm:max-w-md"
          disabled={loading}
        />
        <Button
          type="button"
          onClick={handleApplyFilter}
          disabled={loading}
          className="h-12 w-full shrink-0 px-8 sm:w-auto"
        >
          Apply filter
        </Button>
      </div>

      <p className="text-sm text-on-surface-variant">
        {total === 0 ? 'No employees match this filter.' : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
      </p>

      {employees.length === 0 ? (
        <p className="rounded-xl bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
          No employees to show.
        </p>
      ) : (
        <MobileListStack className={loading ? 'opacity-60' : ''}>
          {employees.map((employee) => {
            const status = employeeStatus(employee);
            const invitationPending = !employee.userId;
            const canDeactivate = employee.userId && employee.isActive;
            const canActivate = employee.userId && !employee.isActive;
            return (
              <MobileListCard key={employee.employeeId}>
                <div className="flex items-center gap-3">
                  <PersonAvatar
                    name={employee.employeeName}
                    email={employee.employeeEmail}
                    src={employee.profilePicture}
                    size={44}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{employee.employeeName}</p>
                    <p className="truncate text-sm text-on-surface-variant">{employee.employeeEmail}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusChip tone={status.tone}>{status.label}</StatusChip>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {invitationPending ? (
                    <Button size="sm" variant="secondary" onClick={() => handleResend(employee)}>
                      Resend invite
                    </Button>
                  ) : null}
                  {canDeactivate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusConfirm({ employee, nextActive: false })}
                    >
                      Deactivate
                    </Button>
                  ) : null}
                  {canActivate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusConfirm({ employee, nextActive: true })}
                    >
                      Activate
                    </Button>
                  ) : null}
                </div>
              </MobileListCard>
            );
          })}
        </MobileListStack>
      )}

      {employees.length > 0 ? (
      <TableCard
        bordered={false}
        className={`rounded-xl ${loading ? 'opacity-60' : ''}`}
        minTableWidth="md:min-w-[44rem]"
      >
          <thead className="bg-surface-container-low text-xs uppercase text-outline">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
              {employees.map((employee) => {
                const status = employeeStatus(employee);
                const invitationPending = !employee.userId;
                const canDeactivate = employee.userId && employee.isActive;
                const canActivate = employee.userId && !employee.isActive;

                return (
                  <tr key={employee.employeeId} className="border-t border-surface-container-high">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          name={employee.employeeName}
                          email={employee.employeeEmail}
                          src={employee.profilePicture}
                          size={44}
                        />
                        <span className="font-medium">{employee.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{employee.employeeEmail}</td>
                    <td className="px-4 py-3">
                      <StatusChip tone={status.tone}>{status.label}</StatusChip>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {invitationPending ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResend(employee)}
                        >
                          Resend invite
                        </Button>
                      ) : null}
                      {canDeactivate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatusConfirm({ employee, nextActive: false })}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                      {canActivate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatusConfirm({ employee, nextActive: true })}
                        >
                          Activate
                        </Button>
                      ) : null}
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
        onPageChange={(next) => load(next, filterEmployeeIds)}
      />

      <Modal open={inviteOpen} title="Invite employee" onClose={() => setInviteOpen(false)} closeOnBackdrop={false}>
        <div className="space-y-3">
          <TextField
            id="emp-name"
            label="Name"
            value={form.employeeName}
            onChange={(ev) => setForm({ ...form, employeeName: ev.target.value })}
          />
          <TextField
            id="emp-email"
            label="Email"
            type="email"
            value={form.employeeEmail}
            onChange={(ev) => setForm({ ...form, employeeEmail: ev.target.value })}
          />
        </div>
        <div className="mt-6">
          <ModalActions
            confirmLabel="Send invite"
            loading={busy}
            onCancel={() => setInviteOpen(false)}
            onConfirm={handleInvite}
          />
        </div>
      </Modal>

      <StatusChangeConfirmModal
        open={Boolean(statusConfirm)}
        kind="employee"
        personLabel={statusConfirm?.employee?.employeeName || statusConfirm?.employee?.employeeEmail}
        nextActive={statusConfirm?.nextActive}
        loading={busy}
        onCancel={() => setStatusConfirm(null)}
        onConfirm={applyStatusChange}
      />
    </div>
  );
}
