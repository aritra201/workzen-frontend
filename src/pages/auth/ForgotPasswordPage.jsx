import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.js';
import { ROUTES } from '../../constants/routes.js';
import {
  getRememberedPasswordResetEmail,
  rememberPasswordResetEmail,
} from '../../utils/passwordResetFlow.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromState = location.state?.email;
    const remembered = getRememberedPasswordResetEmail();
    if (fromState) {
      setEmail(fromState);
      rememberPasswordResetEmail(fromState);
    } else if (remembered) {
      setEmail(remembered);
    }
  }, [location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalized = rememberPasswordResetEmail(email);
      await forgotPassword({ email: normalized });
      navigate(ROUTES.resetPassword, { replace: true, state: { email: normalized } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-md sm:p-8">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Enter your email and we&apos;ll send a reset code if an account exists.
      </p>
      <ErrorMessage message={error} className="mt-4" />
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          id="forgot-email"
          label="Email"
          type="email"
          icon="alternate_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Sending…' : 'Send reset code'}
        </Button>
      </form>
      <p className="mt-6 text-sm">
        <Link to={ROUTES.login}>Back to login</Link>
      </p>
    </div>
  );
}
