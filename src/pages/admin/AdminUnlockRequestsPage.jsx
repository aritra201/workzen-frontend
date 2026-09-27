import { useCallback, useEffect, useState } from 'react';
import { decideUnlockRequest, listUnlockRequestsAdmin } from '../../api/unlockRequests.js';
import ListPagination from '../../components/common/ListPagination.jsx';
import Button from '../../components/ui/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

const PAGE_SIZE = 20;

export default function AdminUnlockRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (pageNum = page) => {
    setLoading(true);
    setError('');
    try {
      const data = await listUnlockRequestsAdmin({
        status: 'pending',
        page: pageNum,
        limit: PAGE_SIZE,
      });
      setRequests(data.requests || []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setPage(data.page ?? pageNum);
    } catch (err) {
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
  }, []);

  async function decide(row, status) {
    try {
      await decideUnlockRequest({ attendanceId: row.attendanceId, status });
      await load(page);
    } catch (err) {
      setError(err.message);
    }
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  if (loading && requests.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Unlock requests</h1>
      <ErrorMessage message={error} />

      <p className="text-sm text-on-surface-variant">
        {total === 0
          ? 'No pending unlock requests.'
          : `Showing ${rangeStart}–${rangeEnd} of ${total} pending`}
      </p>

      <div className={`space-y-3 ${loading ? 'opacity-60' : ''}`}>
        {requests.map((r) => (
          <article
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold">{r.employeeName || 'Employee'}</p>
              <p className="text-sm text-on-surface-variant">{r.date}</p>
              <StatusChip tone="pending">{r.status}</StatusChip>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button size="sm" onClick={() => decide(r, 'approved')}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => decide(r, 'denied')}>Deny</Button>
            </div>
          </article>
        ))}

      </div>

      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPageChange={(next) => load(next)}
      />
    </div>
  );
}
