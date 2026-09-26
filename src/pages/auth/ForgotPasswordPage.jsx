import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-md">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mt-2 text-sm text-on-surface-variant">We&apos;ll email a reset code if the account exists.</p>
      <ErrorMessage message={error} className="mt-4" />
      {message ? <p className="mt-4 text-sm text-primary">{message}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          id="forgot-email"
          label="Email"
          type="email"
          icon="alternate_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={busy}>Send reset code</Button>
      </form>
      <p className="mt-6 text-sm">
        <Link to={ROUTES.resetPassword} className="text-primary font-semibold">I have a code</Link>
        {' · '}
        <Link to={ROUTES.login}>Login</Link>
      </p>
    </div>
  );
}
