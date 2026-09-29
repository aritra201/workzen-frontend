import { useEffect, useState } from 'react';
import { confirmShift, updateShiftDetails } from '../../api/attendance.js';
import { SHIFT_META } from '../../constants/shifts.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import { getSubmitGeoLocation } from '../../utils/geolocation.js';
import {
  isShiftDetailsLockedForEmployee,
  statusLabel,
  statusTone,
} from '../../utils/attendanceUi.js';
import { SHIFT_STATUS } from '../../constants/shifts.js';
import ShiftConfirmModal from './ShiftConfirmModal.jsx';
import EmployeeShiftWorkPictures from './EmployeeShiftWorkPictures.jsx';
import { getShiftWorkPictureUrls } from './WorkPicturesGallery.jsx';
import AccordionSection from '../ui/AccordionSection.jsx';
import Button from '../ui/Button.jsx';
import StatusChip from '../ui/StatusChip.jsx';
import TextField from '../ui/TextField.jsx';

export default function ShiftAttendanceCard({
  shiftKey,
  shift,
  attendance,
  attendanceDate,
  onUpdated,
  readOnly,
  accordionId,
}) {
  const meta = SHIFT_META[shiftKey];
  const [comment, setComment] = useState(shift?.comment ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setComment(shift?.comment ?? '');
  }, [shift?.comment, shiftKey]);

  const marked = Boolean(shift?.marked);
  const locked = attendance?.lockAttendance || !attendance?.canEdit;
  const detailsLocked = isShiftDetailsLockedForEmployee(shift, attendance);
  const disabled = readOnly || locked || detailsLocked;
  const verified = shift?.status === SHIFT_STATUS.VERIFIED;
  const hasShiftAmount =
    shift?.amount != null && !Number.isNaN(Number(shift.amount)) && Number(shift.amount) > 0;
  const pictureUrls = getShiftWorkPictureUrls(shift);
  const savedComment = String(shift?.comment || '').trim();
  const commentDirty = comment.trim() !== savedComment;

  const headerSubtitle = marked
    ? hasShiftAmount
      ? formatCurrencyInr(shift.amount)
      : 'Marked — amount from profile'
    : 'Tap to expand · confirm when you worked this shift';

  async function run(action) {
    setError('');
    setBusy(true);
    try {
      await action();
      await onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    setError('');
    setBusy(true);
    try {
      const geo = await getSubmitGeoLocation();
      if (!geo) {
        setError(
          'Location is required to mark attendance. Allow location when your browser asks, then try again.'
        );
        return;
      }
      await confirmShift({ geoLocation: geo }, { shiftKey, attendanceDate });
      setConfirmOpen(false);
      await onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveComment() {
    await run(() =>
      updateShiftDetails(
        { comment: comment.trim() },
        { shiftKey, attendanceDate }
      )
    );
  }

  if (!meta) {
    return null;
  }

  return (
    <>
      <AccordionSection
        accordionId={accordionId}
        title={meta.label}
        subtitle={headerSubtitle}
        trailing={
          <StatusChip tone={statusTone(shift?.status, locked)}>
            {statusLabel(shift?.status, locked)}
          </StatusChip>
        }
        headerActions={
          !disabled && !marked ? (
            <Button size="sm" onClick={() => setConfirmOpen(true)} disabled={busy}>
              Confirm
            </Button>
          ) : null
        }
        panelClassName="p-4 pt-3"
      >
        {!marked ? (
          <p className="text-sm text-on-surface-variant">
            Confirm this shift if you worked it. Your daily amount from your profile will be applied
            automatically and sent for verification. You can add an optional comment or photos
            after confirming.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="text-xs font-medium text-on-surface-variant">Shift amount (from profile)</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-on-surface">
                {hasShiftAmount ? formatCurrencyInr(shift.amount) : '—'}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Set by your company admin. You do not enter this amount per shift.
              </p>
            </div>

            <TextField
              label="Work comment (optional)"
              id={`comment-${shiftKey}`}
              value={comment}
              disabled={disabled}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add notes about work on site"
              hint={
                verified
                  ? 'This shift is verified — comment cannot be changed'
                  : detailsLocked
                    ? 'This shift can no longer be edited'
                    : 'Optional — you can save or update until verification'
              }
            />

            <EmployeeShiftWorkPictures
              pictureUrls={pictureUrls}
              shiftKey={shiftKey}
              attendanceDate={attendanceDate}
              disabled={disabled}
              busy={busy}
              onBusyChange={setBusy}
              onUpdated={onUpdated}
              onError={setError}
            />

            {!disabled ? (
              <Button
                variant="secondary"
                onClick={handleSaveComment}
                disabled={busy || !comment.trim() || !commentDirty}
              >
                Save comment
              </Button>
            ) : null}
          </div>
        )}

        {error ? <p className="mt-3 text-xs text-error">{error}</p> : null}
      </AccordionSection>

      <ShiftConfirmModal
        open={confirmOpen}
        shiftLabel={meta.label}
        dateLabel={formatDateLabel(attendance?.date, { weekday: true })}
        loading={busy}
        onCancel={() => {
          if (!busy) {
            setConfirmOpen(false);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
