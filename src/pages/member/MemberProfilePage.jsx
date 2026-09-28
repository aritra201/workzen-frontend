import { useEffect, useState } from 'react';
import {
  getMyMemberProfile,
  updateMyMemberProfile,
  uploadMyMemberProfilePicture,
} from '../../api/members.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ChangePasswordSection from '../../components/auth/ChangePasswordSection.jsx';

export default function MemberProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyMemberProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setName(p.name || '');
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await updateMyMemberProfile({ name: name.trim() });
      setProfile(updated);
      setName(updated.name || '');
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const updated = await uploadMyMemberProfilePicture(file);
      setProfile(updated);
      setMessage('Profile photo updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My profile</h1>
        <p className="text-sm text-on-surface-variant">
          Update your display name and photo for {profile?.companyName || 'this company'}.
        </p>
      </div>
      <ErrorMessage message={error} />
      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-card">
        <PersonAvatar
          name={name || profile?.email}
          email={profile?.email}
          src={profile?.profilePicture}
          size={64}
        />
        <label className="cursor-pointer text-sm font-semibold text-primary">
          Upload photo
          <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-card">
        <TextField
          id="memberName"
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          id="memberEmail"
          label="Email"
          value={profile?.email || ''}
          readOnly
          disabled
          hint="Login email cannot be changed here"
        />
        <TextField
          id="memberCompany"
          label="Company"
          value={profile?.companyName || ''}
          readOnly
          disabled
        />
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <ChangePasswordSection />
    </div>
  );
}
