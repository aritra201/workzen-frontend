export function getShiftWorkPictureUrls(shift) {
  const raw = shift?.workPictures ?? shift?.work_picture ?? [];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(Boolean);
}

export default function WorkPicturesGallery({ shift, className = '' }) {
  const urls = getShiftWorkPictureUrls(shift);

  return (
    <div className={className}>
      {urls.length ? (
        <div className="flex flex-wrap gap-2">
          {urls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg ring-1 ring-outline-variant/40 transition hover:ring-primary"
            >
              <img src={url} alt="Work proof" className="h-24 w-24 object-cover sm:h-28 sm:w-28" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">No work pictures uploaded.</p>
      )}
    </div>
  );
}
