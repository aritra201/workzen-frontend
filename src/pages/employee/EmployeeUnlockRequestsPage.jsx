import { useEffect, useMemo, useState } from 'react';
import { listMyAttendance } from '../../api/attendance.js';
import { createUnlockRequest, cancelMyUnlockRequest, listMyUnlockRequests } from '../../api/unlockRequests.js';
import { getMyAttendanceListItems, listRangeLastDays } from '../../utils/myAttendanceList.js';
import EmployeeAttendanceHistoryTable from '../../components/employee/EmployeeAttendanceHistoryTable.jsx';
import Modal, { ModalActions } from '../../components/ui/Modal.jsx';
import { formatDateLabel } from '../../utils/format.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import Button from '../../components/ui/Button.jsx';

export default function EmployeeUnlockRequestsPage() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmRow, setConfirmRow] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const range = listRangeLastDays(90);
      const [attendanceData, unlockData] = await Promise.all([
        listMyAttendance({ ...range, page: 1, limit: 50 }),
        listMyUnlockRequests(),
      ]);
      setAttendanceRows(getMyAttendanceListItems(attendanceData));
      setRequests(unlockData.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pendingAttendanceIds = useMemo(
    () =>
      new Set(
        requests
          .filter((r) => r.status === 'pending')
          .map((r) => String(r.attendanceId))
      ),
    [requests]
  );

  const lockedRows = useMemo(
    () => attendanceRows.filter((row) => row.lockAttendance),
    [attendanceRows]
  );

  async function confirmUnlock() {
    if (!confirmRow) return;
    setSubmitting(true);
    setError('');
    try {
      await createUnlockRequest({ attendanceId: confirmRow.attendanceId });
      setConfirmRow(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Unlock requests</h1>
        <p className="text-sm text-on-surface-variant">
          Request access to edit locked attendance days. Your admin will approve or deny each request.
        </p>
      </div>
      <ErrorMessage message={error} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Locked attendance</h2>
        <EmployeeAttendanceHistoryTable
          records={lockedRows}
          showUnlockAction
          pendingAttendanceIds={pendingAttendanceIds}
          onRequestUnlock={setConfirmRow}
          emptyMessage="No locked attendance in the last 90 days."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your requests</h2>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No unlock requests yet.</p>
          ) : (
            requests.map((r) => (
              <article key={r.id} className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{formatDateLabel(r.date)}</p>
                    <p className="text-xs text-on-surface-variant">Attendance ID: {r.attendanceId}</p>
                  </div>
                  <StatusChip
                    tone={
                      r.status === 'approved' ? 'verified' : r.status === 'denied' ? 'rejected' : 'pending'
                    }
                  >
                    {r.status}
                  </StatusChip>
                </div>
                {r.status === 'pending' ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => cancelMyUnlockRequest(r.id).then(load)}
                  >
                    Cancel request
                  </Button>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <Modal
        open={Boolean(confirmRow)}
        title="Request unlock?"
        onClose={() => !submitting && setConfirmRow(null)}
        closeOnBackdrop={false}
      >
        <p className="text-sm text-on-surface-variant">
          Send an unlock request for{' '}
          <strong className="text-on-surface">{formatDateLabel(confirmRow?.date)}</strong>?
          An admin must approve before you can edit that day&apos;s attendance.
        </p>
        <div className="mt-6">
          <ModalActions
            confirmLabel="Yes, request unlock"
            loading={submitting}
            onCancel={() => setConfirmRow(null)}
            onConfirm={confirmUnlock}
          />
        </div>
      </Modal>
    </div>
  );
}
