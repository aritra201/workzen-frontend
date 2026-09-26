import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMyEmployeeProfile,
  updateMyEmployeeProfile,
  uploadMyEmployeeProfilePicture,
} from '../../api/employees.js';
import { fetchCountryDialCodes } from '../../api/countryCodes.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import CountryCodeCombobox from '../../components/ui/CountryCodeCombobox.jsx';
import CountryNameCombobox from '../../components/ui/CountryNameCombobox.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const EMPTY_FORM = {
  employeeName: '',
  countryCode: '+91',
  phoneNumber: '',
  country: '',
  state: '',
  pinCode: '',
  fullAddress: '',
};

function profileToForm(profile) {
  if (!profile) {
    return { ...EMPTY_FORM };
  }
  return {
    employeeName: profile.employeeName || '',
    countryCode: profile.countryCode || '+91',
    phoneNumber: profile.phoneNumber || '',
    country: profile.country || '',
    state: profile.state || '',
    pinCode: profile.pinCode || '',
    fullAddress: profile.fullAddress || '',
  };
}

function withCurrentOption(options, matchKey, currentValue, fallbackOption) {
  if (!currentValue || options.some((c) => c[matchKey] === currentValue)) {
    return options;
  }
  return [fallbackOption, ...options];
}

export default function EmployeeProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dialCodes, setDialCodes] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [p, codes] = await Promise.all([
          getMyEmployeeProfile(),
          fetchCountryDialCodes().catch(() => []),
        ]);
        if (cancelled) return;
        setProfile(p);
        setForm(profileToForm(p));
        setDialCodes(codes);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCountryCodeSelect(option) {
    setForm((prev) => ({
      ...prev,
      countryCode: option.dialCode,
      country: option.countryName,
    }));
  }

  function handleCountrySelect(option) {
    setForm((prev) => ({
      ...prev,
      country: option.countryName,
      countryCode: option.dialCode,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    const wasMissingName = !profile?.employeeName?.trim();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await updateMyEmployeeProfile({
        employeeName: form.employeeName.trim(),
        countryCode: form.countryCode || null,
        phoneNumber: form.phoneNumber.trim() || null,
        country: form.country.trim() || null,
        state: form.state.trim() || null,
        pinCode: form.pinCode.trim() || null,
        fullAddress: form.fullAddress.trim() || null,
      });
      setProfile(updated);
      setForm(profileToForm(updated));
      setMessage('Profile saved.');
      if (wasMissingName && updated.employeeName?.trim()) {
        navigate(ROUTES.employee.dashboard);
      }
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

  const baseDialOptions =
    dialCodes.length > 0
      ? dialCodes
      : [{ id: 0, countryName: 'India', dialCode: '+91', isoCode: 'IN' }];

  const dialOptions = withCurrentOption(baseDialOptions, 'dialCode', form.countryCode, {
    id: -1,
    countryName: form.country || 'Current',
    dialCode: form.countryCode,
    isoCode: 'XX',
  });

  const countryOptions = withCurrentOption(baseDialOptions, 'countryName', form.country, {
    id: -2,
    countryName: form.country,
    dialCode: form.countryCode || '+91',
    isoCode: 'XX',
  });

  const nameRequired = !profile?.employeeName?.trim();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My profile</h1>
        {nameRequired ? (
          <p className="mt-1 text-sm text-tertiary">Your display name is required before using the portal.</p>
        ) : null}
      </div>
      <ErrorMessage message={error} />
      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-card">
        <PersonAvatar
          name={form.employeeName || profile?.employeeEmail}
          email={profile?.employeeEmail}
          src={profile?.profilePicture}
          size={64}
        />
        <label className="cursor-pointer text-sm font-semibold text-primary">
          Upload photo
          <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-card">
        <TextField
          id="employeeName"
          label="Display name"
          value={form.employeeName}
          onChange={(e) => updateField('employeeName', e.target.value)}
          required
        />
        <TextField
          id="employeeEmail"
          label="Email"
          value={profile?.employeeEmail || ''}
          readOnly
          disabled
          hint="Login email cannot be changed here"
        />

        <div className="grid gap-4 sm:grid-cols-[minmax(140px,1fr)_2fr]">
          <CountryCodeCombobox
            id="countryCode"
            label="Country code"
            value={form.countryCode}
            options={dialOptions}
            onChange={handleCountryCodeSelect}
          />
          <TextField
            id="phoneNumber"
            label="Phone number"
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            hint="National number without country code"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CountryNameCombobox
            id="country"
            label="Country"
            value={form.country}
            options={countryOptions}
            onChange={handleCountrySelect}
          />
          <TextField
            id="state"
            label="State"
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
          />
        </div>

        <TextField
          id="pinCode"
          label="PIN / postal code"
          value={form.pinCode}
          onChange={(e) => updateField('pinCode', e.target.value)}
        />
        <TextField
          id="fullAddress"
          label="Full address"
          value={form.fullAddress}
          onChange={(e) => updateField('fullAddress', e.target.value)}
        />

        <Button type="submit" disabled={saving || !form.employeeName.trim()}>
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </div>
  );
}
