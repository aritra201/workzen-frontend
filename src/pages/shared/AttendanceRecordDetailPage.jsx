import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCompanyAttendanceRecord, verifyShift, adminReplyCommentThread } from '../../api/companyAttendance.js';
import { getMyAttendanceRecord, replyCommentThread } from '../../api/attendance.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import {
  formatShiftStatus,
  responseKeyToApiShiftKey,
  shiftStatusChipTone,
} from '../../utils/shiftLabels.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import ShiftHighlightChips from '../../components/ui/ShiftHighlightChips.jsx';
import WorkPicturesGallery from '../../components/attendance/WorkPicturesGallery.jsx';
import ShiftWorkCommentPanel from '../../components/attendance/ShiftWorkCommentPanel.jsx';
import AttendanceActivityLogSection from '../../components/attendance/AttendanceActivityLogSection.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

function getRecordEmployeeName(record) {
  return record?.employee?.name ?? record?.employeeName ?? 'You';
}

function getRecordEmployeePicture(record) {
  return record?.employee?.profilePicture ?? null;
}

export default function AttendanceRecordDetailPage({ mode, backTo }) {
  const [params] = useSearchParams();
  const attendanceId = params.get('attendanceId');
  const [record, setRecord] = useState(null);
  const [reply, setReply] = useState('');
  const [logRefreshToken, setLogRefreshToken] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attendanceId) return;
    async function load() {
      setLoading(true);
      try {
        const fetcher =
          mode === 'employee'
            ? () => getMyAttendanceRecord({ attendanceId })
            : () => getCompanyAttendanceRecord({ attendanceId });
        const detail = await fetcher();
        setRecord(detail);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attendanceId, mode]);

  async function handleVerify(shiftKey) {
    try {
      await verifyShift({ attendanceId, shiftKey });
      const detail = await getCompanyAttendanceRecord({ attendanceId });
      setRecord(detail);
      setLogRefreshToken((n) => n + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReply(shiftKey) {
    try {
      if (mode === 'employee') {
        await replyCommentThread({ attendanceId, shiftKey, text: reply });
      } else if (mode === 'admin') {
        await adminReplyCommentThread({ attendanceId, shiftKey, text: reply });
      }
      setReply('');
      const detail =
        mode === 'employee'
          ? await getMyAttendanceRecord({ attendanceId })
          : await getCompanyAttendanceRecord({ attendanceId });
      setRecord(detail);
      setLogRefreshToken((n) => n + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!attendanceId) return <p>Missing attendanceId</p>;
  if (loading) return <LoadingSpinner />;
  if (!record) return <ErrorMessage message={error || 'Record not found'} />;

  const shifts = record.shifts || {};
  const employeeName = getRecordEmployeeName(record);

  return (
    <div className="space-y-6">
      <Link to={backTo} className="text-sm font-semibold text-primary">← Back</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {mode !== 'employee' ? (
            <PersonAvatar
              name={employeeName}
              email={record.employee?.email}
              src={getRecordEmployeePicture(record)}
              size={48}
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-bold">Attendance record</h1>
            <p className="text-sm text-on-surface-variant">
              {employeeName} · {formatDateLabel(record.date)}
            </p>
          </div>
        </div>
        <StatusChip tone={record.lockAttendance ? 'locked' : 'pending'}>
          {record.lockAttendance ? 'Locked' : 'Open'}
        </StatusChip>
      </div>
      <ErrorMessage message={error} />

      {Object.entries(shifts).map(([key, shift]) => {
        if (!shift) return null;
        const shiftKey = responseKeyToApiShiftKey(key);
        return (
          <article key={key} className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ShiftHighlightChips shifts={{ [key]: shift }} />
              <StatusChip tone={shiftStatusChipTone(shift.status)}>
                {formatShiftStatus(shift.status)}
              </StatusChip>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_minmax(240px,300px)]">
              <ShiftWorkCommentPanel
                comment={shift.comment}
                className="order-1 lg:order-2 lg:sticky lg:top-4 lg:self-start"
              />
              <div className="order-2 min-w-0 space-y-4 lg:order-1">
                <div className="rounded-lg bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Amount</p>
                  <p className="mt-1 tabular-nums text-2xl font-bold text-on-surface">
                    {shift.amount != null ? formatCurrencyInr(shift.amount) : 'N/A'}
                  </p>
                </div>
                <WorkPicturesGallery shift={shift} />
                {mode === 'admin' && shift.status === 'pending_verification' ? (
                  <Button size="sm" onClick={() => handleVerify(shiftKey)}>Verify shift</Button>
                ) : null}
                {(mode === 'admin' || mode === 'employee') && (
                  <div className="flex gap-2">
                    <TextField
                      id={`reply-${key}`}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Thread reply"
                    />
                    <Button size="sm" variant="secondary" onClick={() => handleReply(shiftKey)}>Reply</Button>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      <AttendanceActivityLogSection attendanceId={attendanceId} refreshToken={logRefreshToken} />
    </div>
  );
}
