import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompany, googleAuthCompanyAdmin } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';
import { homePathForRole, pickPrimaryMembership } from '../../utils/membership.js';
import { ROUTES } from '../../constants/routes.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await registerCompany({ companyName, email, password });
      navigate(ROUTES.verifyEmail, { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle(response) {
    setError('');
    setSubmitting(true);
    try {
      const tokens = await googleAuthCompanyAdmin({ idToken: response.credential });
      const me = await loginWithTokens(tokens);
      const membership = pickPrimaryMembership(me.memberships);
      navigate(membership?.role ? homePathForRole(membership.role) : ROUTES.admin.dashboard, {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl bg-surface-container-lowest p-8 shadow-md">
      <h1 className="text-2xl font-semibold">Register your company</h1>
      <p className="mt-2 text-sm text-on-surface-variant">Create an admin account for your organization.</p>
      <ErrorMessage message={error} className="mt-4" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          id="companyName"
          label="Company name"
          icon="business"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <TextField
          id="email"
          label="Work email"
          type="email"
          icon="alternate_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          id="password"
          label="Password (min 8 characters)"
          type="password"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <div className="my-6">
        <GoogleSignInButton
          disabled={submitting}
          onSuccess={handleGoogle}
          onError={(err) => setError(err?.message || 'Google sign-up failed')}
          text="signup_with"
          label="Sign up with Google"
        />
      </div>

      <p className="text-center text-sm">
        <Link to={ROUTES.login} className="text-primary font-semibold">Already have an account?</Link>
      </p>
    </div>
  );
}
