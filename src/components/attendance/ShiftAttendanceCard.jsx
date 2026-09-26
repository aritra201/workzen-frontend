import { useState } from 'react';
import {
  confirmShift,
  submitShift,
  updateShiftDetails,
  uploadWorkPictures,
} from '../../api/attendance.js';
import { SHIFT_META } from '../../constants/shifts.js';
import { formatCurrencyInr } from '../../utils/format.js';
import { statusLabel, statusTone } from '../../utils/attendanceUi.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import StatusChip from '../ui/StatusChip.jsx';
import TextField from '../ui/TextField.jsx';

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

  const marked = Boolean(shift?.marked);
  const locked = attendance?.lockAttendance || !attendance?.canEdit;
  const disabled = readOnly || locked;

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
    await run(() => confirmShift({ shiftKey, attendanceDate }));
  }

  async function handleSubmit() {
    const geo = await new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
        () => resolve(null),
        { timeout: 8000 }
      );
    });

    await run(() =>
      submitShift(
        {
          amount: Number(amount),
          comment: comment.trim(),
          geoLocation: geo,
        },
        { shiftKey, attendanceDate }
      )
    );
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
          <Button size="sm" onClick={handleConfirm} disabled={busy}>
            Confirm
          </Button>
        ) : null}
      </div>

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
              Proof of work
            </p>
            <div className="flex flex-wrap gap-2">
              {(shift?.workPictures || []).map((url) => (
                <img key={url} src={url} alt="" className="h-14 w-14 rounded-lg object-cover ring-1 ring-outline-variant" />
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
            <div className="flex flex-wrap gap-2">
              {!shift?.amount || !shift?.comment ? (
                <Button onClick={handleSubmit} disabled={busy || !amount || !comment.trim()}>
                  Submit shift
                </Button>
              ) : (
                <Button variant="secondary" onClick={handlePatch} disabled={busy}>
                  Save changes
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
