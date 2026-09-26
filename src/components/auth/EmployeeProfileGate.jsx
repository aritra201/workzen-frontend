import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyEmployeeProfile } from '../../api/employees.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../ui/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function EmployeeProfileGate({ children }) {
  const location = useLocation();
  const onProfilePage = location.pathname.startsWith(ROUTES.employee.profile);
  const [loading, setLoading] = useState(true);
  const [needsName, setNeedsName] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const profile = await getMyEmployeeProfile();
        if (cancelled) return;
        setNeedsName(!profile?.employeeName?.trim());
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setNeedsName(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (loading) {
    return <LoadingSpinner label="Loading your profile…" />;
  }

  if (!needsName || onProfilePage) {
    return children;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Welcome to WorkZen</p>
        <h1 className="mt-2 text-xl font-semibold text-on-surface">Set your name to continue</h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          We need your display name on your employee profile before you can mark attendance, view history,
          or request unlocks. This is required after Google sign-in.
        </p>
        <ErrorMessage message={error} className="mt-4" />
        <Link to={ROUTES.employee.profile} className="mt-6 inline-block w-full">
          <Button className="w-full">Go to profile settings</Button>
        </Link>
      </div>
    </div>
  );
}
