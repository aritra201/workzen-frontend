import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import OtpInput from '../../components/ui/OtpInput.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await resetPassword({ email, otp, newPassword });
      navigate(ROUTES.login, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-md">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <ErrorMessage message={error} className="mt-4" />
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField id="reset-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div>
          <p className="mb-2 text-xs font-medium">Reset code</p>
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
        />
        <Button type="submit" className="w-full" disabled={busy || otp.length < 4}>Update password</Button>
      </form>
      <p className="mt-6 text-sm"><Link to={ROUTES.login}>Back to login</Link></p>
    </div>
  );
}
