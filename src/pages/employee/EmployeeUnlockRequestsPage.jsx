import { useEffect, useState } from 'react';
import { createUnlockRequest, cancelMyUnlockRequest, listMyUnlockRequests } from '../../api/unlockRequests.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

export default function EmployeeUnlockRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [attendanceId, setAttendanceId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listMyUnlockRequests();
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    try {
      await createUnlockRequest({ attendanceId });
      setAttendanceId('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Unlock requests</h1>
      <ErrorMessage message={error} />
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card space-y-3">
        <TextField
          id="unlock-attendance"
          label="Locked attendance ID"
          value={attendanceId}
          onChange={(e) => setAttendanceId(e.target.value)}
        />
        <Button onClick={submit} disabled={!attendanceId}>Request unlock</Button>
      </div>
      <div className="space-y-3">
        {requests.map((r) => (
          <article key={r.id} className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.date}</p>
              <StatusChip tone={r.status === 'approved' ? 'verified' : r.status === 'denied' ? 'rejected' : 'pending'}>
                {r.status}
              </StatusChip>
            </div>
            {r.status === 'pending' ? (
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => cancelMyUnlockRequest(r.id).then(load)}>
                Cancel
              </Button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
