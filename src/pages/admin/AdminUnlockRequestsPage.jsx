import { useEffect, useState } from 'react';
import { decideUnlockRequest, listUnlockRequestsAdmin } from '../../api/unlockRequests.js';
import Button from '../../components/ui/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

export default function AdminUnlockRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await listUnlockRequestsAdmin({ status: 'pending' });
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

  async function decide(row, status) {
    try {
      await decideUnlockRequest({ attendanceId: row.attendanceId, status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Unlock requests</h1>
      <ErrorMessage message={error} />
      <div className="space-y-3">
        {requests.map((r) => (
          <article key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-card">
            <div>
              <p className="font-semibold">{r.employeeName || 'Employee'}</p>
              <p className="text-sm text-on-surface-variant">{r.date}</p>
              <StatusChip tone="pending">{r.status}</StatusChip>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => decide(r, 'approved')}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => decide(r, 'denied')}>Deny</Button>
            </div>
          </article>
        ))}
        {!requests.length ? <p className="text-on-surface-variant">No pending unlock requests.</p> : null}
      </div>
    </div>
  );
}
