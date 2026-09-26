function initialsFrom(name, email) {
  const source = (name || email || '?').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function PersonAvatar({ name, email, src, size = 40, className = '' }) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`shrink-0 rounded-full object-cover ring-2 ring-surface-container-high ${className}`}
        style={dimension}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container ring-2 ring-surface-container-high ${className}`}
      style={dimension}
      aria-hidden
    >
      {initialsFrom(name, email)}
    </div>
  );
}
