/** Strips accidental quotes from .env values — Vite does not remove them. */
export function getGoogleClientId() {
  const raw = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!raw || typeof raw !== 'string') {
    return '';
  }
  return raw.replace(/^['"]|['"]$/g, '').trim();
}

export function isGoogleSignInConfigured() {
  return getGoogleClientId().length > 0;
}
