import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth.js';
import { ROUTES } from '../../constants/routes.js';
import {
  clearPasswordResetEmail,
  getRememberedPasswordResetEmail,
  rememberPasswordResetEmail,
} from '../../utils/passwordResetFlow.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromState = location.state?.email;
    const remembered = getRememberedPasswordResetEmail();
    const resolved = rememberPasswordResetEmail(fromState || remembered);
    if (!resolved) {
      navigate(ROUTES.forgotPassword, { replace: true });
      return;
    }
    setEmail(resolved);
  }, [location.state, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email) {
      navigate(ROUTES.forgotPassword, { replace: true });
      return;
    }
    setError('');
    setBusy(true);
    try {
      await resetPassword({ email, otp, newPassword });
      clearPasswordResetEmail();
      navigate(ROUTES.login, { replace: true, state: { message: 'Password updated — you can log in.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleResend() {
    navigate(ROUTES.forgotPassword, { state: { email } });
  }

  if (!email) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-md sm:p-8">
      <h1 className="text-2xl font-semibold">Enter reset code</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        We sent a code to <strong className="break-all text-on-surface">{email}</strong>. Enter it below
        with your new password.
      </p>
      <ErrorMessage message={error} className="mt-4" />
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-on-surface">Reset code</p>
          <OtpInput value={otp} onChange={setOtp} />
        </div>
        <TextField
          id="new-password"
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" disabled={busy || otp.length < 4}>
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={handleResend}
          className="font-semibold text-primary hover:underline"
        >
          Didn&apos;t receive the code? Resend
        </button>
      </p>
      <p className="mt-3 text-center text-sm">
        <Link to={ROUTES.login}>Back to login</Link>
      </p>
    </div>
  );
}
