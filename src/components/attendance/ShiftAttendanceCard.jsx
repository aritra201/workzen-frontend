import { useEffect, useState } from 'react';
import {
  confirmShift,
  submitShift,
  updateShiftDetails,
  uploadWorkPictures,
} from '../../api/attendance.js';
import { SHIFT_META } from '../../constants/shifts.js';
import { formatCurrencyInr, formatDateLabel } from '../../utils/format.js';
import { getSubmitGeoLocation } from '../../utils/geolocation.js';
import { statusLabel, statusTone } from '../../utils/attendanceUi.js';
import ShiftConfirmModal from './ShiftConfirmModal.jsx';
import WorkPictureLightboxModal from './WorkPictureLightboxModal.jsx';
import { getShiftWorkPictureUrls } from './WorkPicturesGallery.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import StatusChip from '../ui/StatusChip.jsx';
import TextField from '../ui/TextField.jsx';

function hasSavedShiftSubmit(shift) {
  const hasAmount = shift?.amount != null && !Number.isNaN(Number(shift.amount));
  const hasComment = Boolean(String(shift?.comment || '').trim());
  return hasAmount || hasComment;
}

export default function ShiftAttendanceCard({
  shiftKey,
  shift,
  attendance,
  attendanceDate,
  onUpdated,
  readOnly,
}) {
  const meta = SHIFT_META[shiftKey];
  const [amount, setAmount] = useState(shift?.amount ?? '');
  const [comment, setComment] = useState(shift?.comment ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [picturePreviewIndex, setPicturePreviewIndex] = useState(null);

  useEffect(() => {
    setAmount(shift?.amount ?? '');
    setComment(shift?.comment ?? '');
  }, [shift?.amount, shift?.comment, shiftKey]);

  const marked = Boolean(shift?.marked);
  const locked = attendance?.lockAttendance || !attendance?.canEdit;
  const disabled = readOnly || locked;

  const amountValid = amount !== '' && !Number.isNaN(Number(amount)) && Number(amount) > 0;
  const commentValid = Boolean(comment.trim());
  const hasSavedSubmit = hasSavedShiftSubmit(shift);
  const canSubmitFirst = amountValid || commentValid;
  const pictureUrls = getShiftWorkPictureUrls(shift);
  const pictureCount = pictureUrls.length;

  function submitHint() {
    if (hasSavedSubmit || disabled) {
      return null;
    }
    if (!amountValid && !commentValid) {
      return 'Enter shift amount or work comment to submit. Proof photos are optional.';
    }
    return 'Ready to submit. You can add the other field later. Photos are optional.';
  }

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
      await confirmShift({ shiftKey, attendanceDate });
      setConfirmOpen(false);
      await onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit() {
    setError('');
    setBusy(true);
    try {
      const geo = await getSubmitGeoLocation();
      if (!geo) {
        setError(
          'Location is required to submit. Allow location when your browser asks, then tap Submit shift again.'
        );
        return;
      }

      const body = { geoLocation: geo };
      if (amountValid) {
        body.amount = Number(amount);
      }
      if (commentValid) {
        body.comment = comment.trim();
      }

      await submitShift(body, { shiftKey, attendanceDate });
      await onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePatch() {
    await run(() =>
      updateShiftDetails(
        {
          amount: amount === '' ? undefined : Number(amount),
          comment: comment.trim() || undefined,
        },
        { shiftKey, attendanceDate }
      )
    );
  }

  async function handlePhotos(event) {
    const files = [...(event.target.files || [])];
    if (!files.length) {
      return;
    }
    await run(() => uploadWorkPictures(files, { shiftKey, attendanceDate }));
    event.target.value = '';
  }

  if (!meta) {
    return null;
  }

  return (
    <article className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{meta.label}</h3>
            <StatusChip tone={statusTone(shift?.status, locked)}>
              {statusLabel(shift?.status, locked)}
            </StatusChip>
          </div>
          {!marked ? (
            <p className="mt-1 text-xs text-on-surface-variant">Confirm this shift to begin entry.</p>
          ) : null}
        </div>
        {!disabled && !marked ? (
          <Button size="sm" onClick={() => setConfirmOpen(true)} disabled={busy}>
            Confirm
          </Button>
        ) : null}
      </div>

      <WorkPictureLightboxModal
        open={picturePreviewIndex != null}
        urls={pictureUrls}
        index={picturePreviewIndex ?? 0}
        onClose={() => setPicturePreviewIndex(null)}
        onIndexChange={setPicturePreviewIndex}
      />

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

      {marked ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-surface-container-low p-3">
            <label className="text-xs font-medium text-on-surface-variant">Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              disabled={disabled}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {shift?.amount != null ? (
              <p className="mt-1 text-xs text-on-surface-variant">
                Saved: {formatCurrencyInr(shift.amount)}
              </p>
            ) : null}
          </div>

          <TextField
            label="Work comment"
            id={`comment-${shiftKey}`}
            value={comment}
            disabled={disabled}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe work completed on site"
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Proof of work {pictureCount ? `(${pictureCount})` : '(optional)'}
            </p>
            <div className="flex flex-wrap gap-2">
              {pictureUrls.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setPicturePreviewIndex(index)}
                  className="overflow-hidden rounded-lg ring-1 ring-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <img src={url} alt="" className="h-14 w-14 object-cover" />
                </button>
              ))}
              {!disabled ? (
                <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <Icon name="add_a_photo" size={20} />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                </label>
              ) : null}
            </div>
          </div>

          {!disabled ? (
            <div className="space-y-2">
              {submitHint() ? (
                <p className="text-xs text-on-surface-variant">{submitHint()}</p>
              ) : null}
              {hasSavedSubmit ? (
                <Button
                  variant="secondary"
                  onClick={handlePatch}
                  disabled={busy || (!amountValid && !commentValid)}
                >
                  Save changes
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={busy || !canSubmitFirst}>
                  Submit shift
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-error">{error}</p> : null}
    </article>
  );
}
