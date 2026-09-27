import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCompanyAttendanceRecord, verifyShift, adminReplyCommentThread } from '../../api/companyAttendance.js';
import { getMyAttendanceRecord, replyCommentThread } from '../../api/attendance.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import {
  formatShiftResponseKey,
  formatShiftStatus,
  responseKeyToApiShiftKey,
  shiftStatusChipTone,
} from '../../utils/shiftLabels.js';
import VerifyShiftConfirmModal from '../../components/attendance/VerifyShiftConfirmModal.jsx';
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
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyBusy, setVerifyBusy] = useState(false);

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

  async function handleVerifyConfirm() {
    if (!verifyTarget?.shiftKey) {
      return;
    }
    setError('');
    setVerifyBusy(true);
    try {
      await verifyShift({ attendanceId, shiftKey: verifyTarget.shiftKey });
      const detail = await getCompanyAttendanceRecord({ attendanceId });
      setRecord(detail);
      setLogRefreshToken((n) => n + 1);
      setVerifyTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifyBusy(false);
    }
  }

  function openVerifyModal(responseKey, shiftKey, shift) {
    setVerifyTarget({
      shiftKey,
      shiftLabel: formatShiftResponseKey(responseKey),
      amountLabel: shift.amount != null ? formatCurrencyInr(shift.amount) : null,
    });
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
      if (mode !== 'employee') {
        setLogRefreshToken((n) => n + 1);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const showActivityLog = mode === 'admin' || mode === 'member';

  if (!attendanceId) return <p>Missing attendanceId</p>;
  if (loading) return <LoadingSpinner />;
  if (!record) {
    return <ErrorMessage message={error || 'Record not found'} display="inline" />;
  }

  const shifts = record.shifts || {};
  const employeeName = getRecordEmployeeName(record);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Link to={backTo} className="text-sm font-semibold text-primary">← Back</Link>

      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-outline-variant/40 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          {mode !== 'employee' ? (
            <PersonAvatar
              name={employeeName}
              email={record.employee?.email}
              src={getRecordEmployeePicture(record)}
              size={40}
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">Attendance record</h1>
            <p className="label-caps text-on-surface-variant">
              {employeeName} · {formatDateLabel(record.date)}
            </p>
          </div>
        </div>
        <StatusChip tone={record.lockAttendance ? 'locked' : 'neutral'}>
          {record.lockAttendance ? 'Locked' : 'Open'}
        </StatusChip>
      </header>

      <ErrorMessage message={error} />

      {Object.entries(shifts).map(([key, shift]) => {
        if (!shift) return null;
        const shiftKey = responseKeyToApiShiftKey(key);
        return (
          <article key={key} className="ledger-panel p-3 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/30 pb-2">
              <ShiftHighlightChips shifts={{ [key]: shift }} />
              <StatusChip tone={shiftStatusChipTone(shift.status)}>
                {formatShiftStatus(shift.status)}
              </StatusChip>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_minmax(200px,260px)]">
              <ShiftWorkCommentPanel
                comment={shift.comment}
                className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start"
              />
              <div className="order-2 min-w-0 space-y-3 lg:order-1">
                <div className="rounded-md border border-outline-variant/30 bg-surface-container-lowest px-3 py-2">
                  <p className="label-caps text-on-surface-variant">Amount</p>
                  <p className="label-numeric mt-0.5 text-xl font-semibold text-on-surface">
                    {shift.amount != null ? formatCurrencyInr(shift.amount) : 'N/A'}
                  </p>
                </div>
                <WorkPicturesGallery shift={shift} compact />
                {mode === 'admin' && shift.status === 'pending_verification' ? (
                  <Button size="sm" onClick={() => openVerifyModal(key, shiftKey, shift)}>
                    Verify shift
                  </Button>
                ) : null}
                {(mode === 'admin' || mode === 'employee') && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <TextField
                      id={`reply-${key}`}
                      label="Thread reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write a reply…"
                      className="min-w-0 flex-1"
                    />
                    <Button size="sm" variant="secondary" onClick={() => handleReply(shiftKey)}>Reply</Button>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {showActivityLog ? (
        <AttendanceActivityLogSection attendanceId={attendanceId} refreshToken={logRefreshToken} />
      ) : null}

      <VerifyShiftConfirmModal
        open={Boolean(verifyTarget)}
        employeeName={employeeName}
        shiftLabel={verifyTarget?.shiftLabel}
        dateLabel={formatDateLabel(record.date)}
        amountLabel={verifyTarget?.amountLabel}
        loading={verifyBusy}
        onCancel={() => {
          if (!verifyBusy) {
            setVerifyTarget(null);
          }
        }}
        onConfirm={handleVerifyConfirm}
      />
    </div>
  );
}
