import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, loginGoogle } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';
import { homePathForRole, pickPrimaryMembership } from '../../utils/membership.js';
import { ROUTES } from '../../constants/routes.js';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import Icon from '../../components/ui/Icon.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function completeAuth(tokens) {
    const me = await loginWithTokens(tokens);
    const membership = pickPrimaryMembership(me.memberships);
    navigate(membership?.role ? homePathForRole(membership.role) : ROUTES.home, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const tokens = await login({ email, password });
      await completeAuth(tokens);
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
      const tokens = await loginGoogle({ idToken: response.credential });
      await completeAuth(tokens);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-md sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <img src={WORKZEN_LOGO_SRC} alt="" className="h-12 w-12 rounded-lg bg-surface-container-low p-1" />
            <div>
              <p className="text-lg font-semibold">WorkZen</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Field Operations & Ledger OS
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Sign in to manage attendance, verification, and payroll ledgers.
          </p>

          <ErrorMessage message={error} className="mt-4" />

          <div className="mt-6">
            <GoogleSignInButton
              disabled={submitting}
              onSuccess={handleGoogle}
              onError={(err) => setError(err?.message || 'Google sign-in failed')}
            />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-container-high" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              or email
            </span>
            <div className="h-px flex-1 bg-surface-container-high" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              id="login-email"
              label="Work email"
              type="email"
              icon="alternate_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium">Password</span>
                <Link to={ROUTES.forgotPassword} className="text-xs font-medium text-primary">
                  Forgot?
                </Link>
              </div>
              <TextField
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                suffix={
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 z-[2] -translate-y-1/2 rounded p-1 text-on-surface-variant hover:text-on-surface"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <Icon name={showPassword ? 'visibility' : 'visibility_off'} size={20} />
                  </button>
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Log in to WorkZen'}
              <Icon name="arrow_forward" size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            New organization?{' '}
            <Link to={ROUTES.register} className="font-semibold text-primary">Register company</Link>
          </p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-on-primary shadow-md">
          <div>
            <p className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase">
              Live field sync
            </p>
            <h2 className="mt-4 text-xl font-bold">Civil site ledger & punch</h2>
            <p className="mt-2 text-sm text-on-primary/90">
              Geofenced roll calls, shift verification, and wage reconciliation in one workspace.
            </p>
          </div>
          <div className="mt-8 rounded-lg bg-white/10 p-4 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase opacity-80">Daily reconciliation</p>
            <p className="text-2xl font-bold tabular-nums">98.4%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
