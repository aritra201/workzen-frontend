const DEFAULT_SCHEME = import.meta.env.VITE_MOBILE_APP_SCHEME || 'workzen';

export function mobileInviteDeepLink(kind, token) {
  return `${DEFAULT_SCHEME}://invite/${kind}?token=${encodeURIComponent(token)}`;
}

export function isMobileUserAgent() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
