const PASSWORD_RESET_EMAIL_KEY = 'workzen_password_reset_email';

export function rememberPasswordResetEmail(email) {
  const trimmed = String(email || '').trim().toLowerCase();
  if (trimmed) {
    sessionStorage.setItem(PASSWORD_RESET_EMAIL_KEY, trimmed);
  }
  return trimmed;
}

export function getRememberedPasswordResetEmail() {
  return sessionStorage.getItem(PASSWORD_RESET_EMAIL_KEY) || '';
}

export function clearPasswordResetEmail() {
  sessionStorage.removeItem(PASSWORD_RESET_EMAIL_KEY);
}
