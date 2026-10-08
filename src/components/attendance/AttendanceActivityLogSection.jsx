import { useEffect, useState } from 'react';
import {
  activityLogObjectEntries,
  formatActivityActionType,
  formatActivityActorLine,
  formatActivityActorRole,
  getActivityLogDetail,
  getActivityLogListItems,
  listActivityLogsForAttendance,
} from '../../api/activityLogs.js';
import Icon from '../ui/Icon.jsx';
import Modal from '../ui/Modal.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

function formatLogTime(createdAt) {
  if (!createdAt) {
    return '';
  }
  return new Date(createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ValueSnapshotCard({ title, data, variant }) {
  const entries = activityLogObjectEntries(data);
  const styles =
    variant === 'before'
      ? 'border-amber-200/80 bg-amber-50/60'
      : variant === 'after'
        ? 'border-emerald-200/80 bg-emerald-50/60'
        : 'border-outline-variant/30 bg-surface-container-low';

  if (!entries.length) {
    return (
      <div className={`rounded-xl border p-4 ${styles}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{title}</p>
        <p className="mt-2 text-sm text-on-surface-variant">—</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">{title}</p>
      <ul className="mt-3 space-y-2">
        {entries.map(({ key, label, value }) => (
          <li key={key} className="flex items-start justify-between gap-3 border-b border-black/5 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-on-surface-variant">{label}</span>
            <span className="max-w-[65%] break-all text-right text-sm font-medium text-on-surface">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityLogDetailBody({ log }) {
  if (!log) {
    return null;
  }

  const hasBefore = log.beforeValue != null && activityLogObjectEntries(log.beforeValue).length > 0;
  const hasAfter = log.afterValue != null && activityLogObjectEntries(log.afterValue).length > 0;
  const metaEntries = activityLogObjectEntries(log.metadata);

  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-xl bg-surface-container-low p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Summary</p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-on-surface-variant">Action</dt>
            <dd className="font-medium text-on-surface">{formatActivityActionType(log.actionType)}</dd>
          </div>
          <div>
            <dt className="text-xs text-on-surface-variant">When</dt>
            <dd className="text-on-surface">{formatLogTime(log.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-on-surface-variant">Actor</dt>
            <dd className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-on-surface">{log.actorEmail || '—'}</span>
              {log.actorRole ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {formatActivityActorRole(log.actorRole)}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>
      </div>

      {(hasBefore || hasAfter) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <ValueSnapshotCard title="Before" data={log.beforeValue} variant="before" />
          <ValueSnapshotCard title="After" data={log.afterValue} variant="after" />
        </div>
      )}

      {metaEntries.length > 0 ? (
        <ValueSnapshotCard title="Metadata" data={log.metadata} variant="neutral" />
      ) : null}
    </div>
  );
}

export default function AttendanceActivityLogSection({
  attendanceId,
  refreshToken,
  embedded = false,
}) {
  const [logs, setLogs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    if (!attendanceId) {
      setLogs([]);
      setListLoading(false);
      return;
    }

    let cancelled = false;

    async function loadList() {
      setListLoading(true);
      setListError('');
      try {
        const data = await listActivityLogsForAttendance(attendanceId);
        if (!cancelled) {
          setLogs(getActivityLogListItems(data));
        }
      } catch (err) {
        if (!cancelled) {
          setListError(err.message);
          setLogs([]);
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    }

    loadList();
    return () => {
      cancelled = true;
    };
  }, [attendanceId, refreshToken]);

  async function openDetail(activityLogId) {
    setSelectedId(activityLogId);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const data = await getActivityLogDetail(activityLogId);
      setDetail(data);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setSelectedId(null);
    setDetail(null);
    setDetailError('');
  }

  const shellClass = embedded
    ? 'p-4 sm:p-5'
    : 'rounded-xl bg-surface-container-lowest p-4 shadow-card sm:p-5';

  return (
    <section className={shellClass}>
      {!embedded ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="history" size={20} />
            </span>
            <div>
              <h3 className="font-semibold text-on-surface">Attendance activity log</h3>
              <p className="text-xs text-on-surface-variant">
                {listLoading ? 'Loading…' : `${logs.length} event${logs.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mb-3 text-xs text-on-surface-variant">
          {listLoading ? 'Loading…' : `${logs.length} event${logs.length === 1 ? '' : 's'}`}
        </p>
      )}

      {listError ? (
        <p className={`text-sm text-error ${embedded ? '' : 'mt-4'}`}>{listError}</p>
      ) : null}

      {listLoading ? (
        <div className={`py-8 ${embedded ? '' : 'mt-6'}`}>
          <LoadingSpinner label="Loading activity log…" />
        </div>
      ) : !logs.length ? (
        <p className={`text-sm text-on-surface-variant ${embedded ? '' : 'mt-4'}`}>
          No activity entries for this attendance yet.
        </p>
      ) : (
        <div
          className={`max-h-[min(28rem,55vh)] overflow-y-auto overscroll-y-contain rounded-lg border border-outline-variant/30 bg-surface-container-lowest/50 ${embedded ? '' : 'mt-4'}`}
          aria-label="Activity log entries"
        >
          <ul className="divide-y divide-surface-container-high">
          {logs.map((log) => {
            const id = log.activityLogId || log.id;
            const actorLine =
              log.actorEmail ||
              (log.actorRole ? formatActivityActorRole(log.actorRole) : formatActivityActorLine(log));
            const timeLine = log.createdAt ? formatLogTime(log.createdAt) : '';
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => openDetail(id)}
                  className="-mx-2 flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition hover:bg-surface-container-low/80"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-primary">
                    <Icon name="receipt_long" size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-on-surface">
                        {formatActivityActionType(log.actionType)}
                      </span>
                      {log.actorRole ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {formatActivityActorRole(log.actorRole)}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      <span className="font-medium text-on-surface">Actor:</span> {actorLine}
                      {timeLine ? ` · ${timeLine}` : ''}
                    </span>
                  </span>
                  <Icon name="chevron_right" className="shrink-0 text-on-surface-variant" size={22} />
                </button>
              </li>
            );
          })}
          </ul>
        </div>
      )}

      <Modal
        open={Boolean(selectedId)}
        title="Activity details"
        onClose={closeDetail}
        closeOnBackdrop={false}
      >
        {detailLoading ? (
          <LoadingSpinner label="Loading details…" />
        ) : detailError ? (
          <p className="text-sm text-error">{detailError}</p>
        ) : (
          <ActivityLogDetailBody log={detail} />
        )}
      </Modal>
    </section>
  );
}
