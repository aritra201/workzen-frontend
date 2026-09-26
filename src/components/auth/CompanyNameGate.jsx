import { useEffect, useState } from 'react';
import { getCompanyProfile, updateCompanyProfile } from '../../api/company.js';
import Button from '../ui/Button.jsx';
import TextField from '../ui/TextField.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function CompanyNameGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [needsName, setNeedsName] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const profile = await getCompanyProfile();
        if (cancelled) return;
        const missing = !profile?.companyName?.trim();
        setNeedsName(missing);
      } catch {
        if (!cancelled) {
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
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateCompanyProfile({ companyName: companyName.trim() });
      setNeedsName(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading company…" />;
  }

  if (!needsName) {
    return children;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSave}
        className="w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-card"
      >
        <h1 className="text-xl font-semibold text-on-surface">Name your company</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Complete onboarding by setting your organization name.
        </p>
        <ErrorMessage message={error} className="mt-4" />
        <TextField
          className="mt-6"
          id="companyName"
          label="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          icon="business"
        />
        <Button type="submit" className="mt-6 w-full" disabled={saving || !companyName.trim()}>
          {saving ? 'Saving…' : 'Continue to dashboard'}
        </Button>
      </form>
    </div>
  );
}
