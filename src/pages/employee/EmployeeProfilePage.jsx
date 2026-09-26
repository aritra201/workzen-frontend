import { useEffect, useState } from 'react';
import { getMyEmployeeProfile, updateMyEmployeeProfile, uploadMyEmployeeProfilePicture } from '../../api/employees.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyEmployeeProfile()
      .then((p) => {
        setProfile(p);
        setPhoneNumber(p.phoneNumber || '');
        setFullAddress(p.fullAddress || '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError('');
    try {
      const updated = await updateMyEmployeeProfile({ phoneNumber, fullAddress });
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadMyEmployeeProfilePicture(file);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Profile</h1>
      <ErrorMessage message={error} />
      <div className="flex items-center gap-4">
        {profile?.profilePicture ? (
          <img src={profile.profilePicture} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : null}
        <label className="text-sm font-semibold text-primary">
          Update photo
          <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </label>
      </div>
      <p className="text-lg font-semibold">{profile?.employeeName}</p>
      <p className="text-sm text-on-surface-variant">{profile?.employeeEmail}</p>
      <TextField id="phone" label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <TextField id="address" label="Address" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
      <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
    </div>
  );
}
