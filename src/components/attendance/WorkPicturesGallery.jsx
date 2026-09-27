import { useState } from 'react';
import WorkPictureLightboxModal from './WorkPictureLightboxModal.jsx';

export function getShiftWorkPictureUrls(shift) {
  const raw = shift?.workPictures ?? shift?.work_picture ?? [];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(Boolean);
}

export default function WorkPicturesGallery({ shift, className = '', compact = false }) {
  const urls = getShiftWorkPictureUrls(shift);
  const thumbClass = compact ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-24 w-24 sm:h-28 sm:w-28';
  const [lightboxIndex, setLightboxIndex] = useState(null);

  function openAt(index) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  return (
    <div className={className}>
      <p className="label-caps mb-1.5 text-on-surface-variant">Proof of work</p>
      {urls.length ? (
        <div className="flex flex-wrap gap-1.5">
          {urls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => openAt(index)}
              className="block overflow-hidden rounded-md border border-outline-variant/40 transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <img src={url} alt="Work proof" className={`${thumbClass} object-cover`} />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">No work pictures uploaded.</p>
      )}

      <WorkPictureLightboxModal
        open={lightboxIndex != null}
        urls={urls}
        index={lightboxIndex ?? 0}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
