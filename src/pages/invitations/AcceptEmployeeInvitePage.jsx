import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  acceptEmployeeInvitation,
  acceptEmployeeInvitationGoogle,
  previewEmployeeInvitation,
} from '../../api/invitations.js';
import { useAuth } from '../../hooks/useAuth.js';
import { homePathForRole, pickPrimaryMembership } from '../../utils/membership.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function AcceptEmployeeInvitePage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    previewEmployeeInvitation(token)
      .then(setPreview)
      .catch((err) => setError(err.message));
  }, [token]);

  async function finish(tokens) {
    const me = await loginWithTokens(tokens);
    const membership = pickPrimaryMembership(me.memberships);
    navigate(membership?.role ? homePathForRole(membership.role) : ROUTES.employee.dashboard, {
      replace: true,
    });
  }

  async function handleAccept(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const tokens = await acceptEmployeeInvitation({ token, password });
      await finish(tokens);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle(response) {
    setBusy(true);
    setError('');
    try {
      const tokens = await acceptEmployeeInvitationGoogle({ token, idToken: response.credential });
      await finish(tokens);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return <p className="text-center text-error">Missing invitation token in URL.</p>;
  }

  if (!preview && !error) {
    return <LoadingSpinner label="Loading invitation…" />;
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-md">
      <h1 className="text-2xl font-semibold">Join as employee</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        {preview?.companyName} invited <strong>{preview?.email}</strong>
      </p>
      <ErrorMessage message={error} className="mt-4" />
      <form onSubmit={handleAccept} className="mt-6 space-y-4">
        <TextField
          id="employee-password"
          label="Create password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" className="w-full" disabled={busy}>Accept invitation</Button>
      </form>
      <div className="mt-4">
        <GoogleSignInButton onSuccess={handleGoogle} onError={() => setError('Google failed')} />
      </div>
      <p className="mt-6 text-center text-sm"><Link to={ROUTES.login}>Login</Link></p>
    </div>
  );
}
