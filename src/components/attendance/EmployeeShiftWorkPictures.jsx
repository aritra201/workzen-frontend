import { useState } from 'react';
import { deleteWorkPictures, replaceWorkPictures, uploadWorkPictures } from '../../api/attendance.js';
import Icon from '../ui/Icon.jsx';
import WorkPictureLightboxModal from './WorkPictureLightboxModal.jsx';

/** Matches backend `MAX_WORK_PICTURES` in attendanceUpload.helper.js */
export const MAX_SHIFT_WORK_PICTURES = 10;

export default function EmployeeShiftWorkPictures({
  pictureUrls,
  shiftKey,
  attendanceDate,
  disabled,
  busy,
  onBusyChange,
  onUpdated,
  onError,
}) {
  const [previewIndex, setPreviewIndex] = useState(null);

  async function run(action) {
    onError('');
    onBusyChange(true);
    try {
      await action();
      await onUpdated();
    } catch (err) {
      onError(err.message);
    } finally {
      onBusyChange(false);
    }
  }

  async function handleUpload(event) {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    if (!files.length) {
      return;
    }
    await run(() => uploadWorkPictures(files, { shiftKey, attendanceDate }));
  }

  async function handleRemove(url) {
    await run(() => deleteWorkPictures({ urls: [url] }, { shiftKey, attendanceDate }));
    setPreviewIndex(null);
  }

  async function handleReplace(url, event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    await run(() => replaceWorkPictures([file], [url], { shiftKey, attendanceDate }));
  }

  const canAddMore = pictureUrls.length < MAX_SHIFT_WORK_PICTURES;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        Proof of work {pictureUrls.length ? `(${pictureUrls.length})` : '(optional)'}
      </p>
      <div className="flex flex-wrap gap-2">
        {pictureUrls.map((url, index) => (
          <div key={url} className="relative">
            <button
              type="button"
              disabled={busy}
              onClick={() => setPreviewIndex(index)}
              className="block overflow-hidden rounded-lg ring-1 ring-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            >
              <img src={url} alt="" className="h-14 w-14 object-cover" />
            </button>
            {!disabled ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  aria-label="Remove photo"
                  onClick={() => handleRemove(url)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white shadow-sm disabled:opacity-60"
                >
                  <Icon name="close" size={14} />
                </button>
                <label
                  className={`absolute bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center rounded-b-lg bg-slate-900/65 py-0.5 text-[10px] font-medium text-white ${busy ? 'pointer-events-none opacity-60' : ''}`}
                >
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => handleReplace(url, e)}
                  />
                </label>
              </>
            ) : null}
          </div>
        ))}
        {!disabled && canAddMore ? (
          <label
            className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant ${busy ? 'pointer-events-none opacity-60' : ''}`}
          >
            <Icon name="add_a_photo" size={20} />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={busy}
              onChange={handleUpload}
            />
          </label>
        ) : null}
      </div>
      {!disabled && !canAddMore ? (
        <p className="mt-1.5 text-xs text-on-surface-variant">
          Maximum {MAX_SHIFT_WORK_PICTURES} photos per shift. Remove or replace one to change.
        </p>
      ) : null}

      <WorkPictureLightboxModal
        open={previewIndex != null}
        urls={pictureUrls}
        index={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
        onIndexChange={setPreviewIndex}
      />
    </div>
  );
}
