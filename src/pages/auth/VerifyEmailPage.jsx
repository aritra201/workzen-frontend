import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resendVerification, verifyEmail } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';
import { homePathForRole, pickPrimaryMembership } from '../../utils/membership.js';
import { ROUTES } from '../../constants/routes.js';
import OtpInput from '../../components/ui/OtpInput.jsx';
import Button from '../../components/ui/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ResendVerificationConfirmModal from '../../components/auth/ResendVerificationConfirmModal.jsx';
import { useToast } from '../../hooks/useToast.js';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithTokens } = useAuth();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const toast = useToast();

  async function handleVerify(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const tokens = await verifyEmail({ email, otp });
      const me = await loginWithTokens(tokens);
      const membership = pickPrimaryMembership(me.memberships);
      navigate(membership?.role ? homePathForRole(membership.role) : ROUTES.admin.dashboard, {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResendConfirm() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter your email before resending a code.');
      setResendOpen(false);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const res = await resendVerification({ email: trimmed });
      setResendOpen(false);
      toast.success(
        res?.message || 'If that email is registered and unverified, a new code has been sent.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-md text-center">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="mt-2 text-sm text-on-surface-variant">Enter the 4-digit code we sent to your inbox.</p>
      <ErrorMessage message={error} className="mt-4 text-left" />
      <form onSubmit={handleVerify} className="mt-8 space-y-6">
        <TextField
          id="verify-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-left"
        />
        <OtpInput value={otp} onChange={setOtp} disabled={busy} />
        <Button type="submit" className="w-full" disabled={busy || otp.length < 4}>
          Verify & continue
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setResendOpen(true)}
        className="mt-4 text-sm font-semibold text-primary"
        disabled={busy}
      >
        Resend code
      </button>
      <p className="mt-6 text-sm">
        <Link to={ROUTES.login}>Back to login</Link>
      </p>

      <ResendVerificationConfirmModal
        open={resendOpen}
        email={email.trim()}
        loading={busy}
        onCancel={() => !busy && setResendOpen(false)}
        onConfirm={handleResendConfirm}
      />
    </div>
  );
}
