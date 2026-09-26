import { useEffect, useState } from 'react';
import { inviteEmployee, listEmployees, resendEmployeeInvite, updateEmployeeStatus } from '../../api/employees.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import Modal, { ModalActions } from '../../components/ui/Modal.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChangeConfirmModal from '../../components/admin/StatusChangeConfirmModal.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState({ employeeName: '', employeeEmail: '' });
  const [busy, setBusy] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await listEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleInvite() {
    setBusy(true);
    setError('');
    try {
      await inviteEmployee(form);
      setInviteOpen(false);
      setForm({ employeeName: '', employeeEmail: '' });
      await load();
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
      await load();
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
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Employees & labour</h1>
        <Button onClick={() => setInviteOpen(true)}>Invite employee</Button>
      </div>
      <ErrorMessage message={error} />

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
        <table className="w-full text-left text-sm">
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
        </table>
      </div>

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
