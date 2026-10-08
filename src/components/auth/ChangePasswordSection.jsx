import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { changePassword, fetchMe } from '../../api/auth.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../ui/Button.jsx';
import TextField from '../ui/TextField.jsx';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

function clearFields(setters) {
  setters.setCurrentPassword('');
  setters.setNewPassword('');
  setters.setConfirmPassword('');
}

export default function ChangePasswordSection({ className = '' }) {
  const [authProvider, setAuthProvider] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) {
          setAuthProvider(me.auth_provider || 'local');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function closeFormModal() {
    if (saving) {
      return;
    }
    setFormOpen(false);
    setConfirmOpen(false);
    setError('');
    clearFields({ setCurrentPassword, setNewPassword, setConfirmPassword });
  }

  function validateForm() {
    if (!currentPassword.trim()) {
      setError('Enter your current password.');
      return false;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return false;
    }
    if (currentPassword === newPassword) {
      setError('New password must be different from the current password.');
      return false;
    }
    return true;
  }

  function handleContinueToConfirm(event) {
    event.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }
    setConfirmOpen(true);
  }

  async function handleConfirmChange() {
    setSaving(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      setMessage(result?.message || 'Password updated successfully.');
      closeFormModal();
      clearFields({ setCurrentPassword, setNewPassword, setConfirmPassword });
    } catch (err) {
      setConfirmOpen(false);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className={`rounded-xl bg-surface-container-lowest p-5 shadow-card ${className}`}>
        <LoadingSpinner label="Loading account…" />
      </section>
    );
  }

  if (authProvider === 'google') {
    return (
      <section className={`rounded-xl bg-surface-container-lowest p-5 shadow-card ${className}`}>
        <h2 className="text-base font-semibold text-on-surface">Password</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          You sign in with Google. Password is managed by your Google account, not WorkZen.
        </p>
      </section>
    );
  }

  return (
    <section className={`rounded-xl bg-surface-container-lowest p-5 shadow-card ${className}`}>
      <h2 className="text-base font-semibold text-on-surface">Password</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Update the password you use to sign in with email.
      </p>
      <ErrorMessage message={!formOpen && !confirmOpen ? error : ''} display="inline" className="mt-3" />
      {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setError('');
            setFormOpen(true);
          }}
        >
          Change password
        </Button>
        <Link to={ROUTES.forgotPassword} className="text-sm font-semibold text-primary">
          Forgot password?
        </Link>
      </div>

      <Modal open={formOpen} title="Change password" onClose={closeFormModal} closeOnBackdrop={false}>
        <p className="text-sm text-on-surface-variant">
          Use at least 8 characters. You may need to sign in again on other devices.
        </p>
        {error && !confirmOpen ? <p className="mt-3 text-sm text-error">{error}</p> : null}
        <form onSubmit={handleContinueToConfirm} className="mt-4 space-y-4">
          <TextField
            id="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Continue
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirmOpen}
        title="Confirm password change?"
        onClose={() => {
          if (!saving) {
            setConfirmOpen(false);
          }
        }}
        closeOnBackdrop={false}
        preventClose={saving}
      >
        <p className="text-sm text-on-surface-variant">
          Your login password will be updated. Other devices may be signed out and will need the new
          password.
        </p>
        <p className="mt-2 text-sm text-on-surface">Do you want to continue?</p>
        <div className="mt-6">
          <ModalActions
            confirmLabel="Yes, update password"
            loading={saving}
            onCancel={() => {
              if (!saving) {
                setConfirmOpen(false);
              }
            }}
            onConfirm={handleConfirmChange}
          />
        </div>
      </Modal>
    </section>
  );
}
