import { useEffect, useState } from 'react';
import { getCompanyProfile, updateCompanyProfile, uploadCompanyProfilePicture } from '../../api/company.js';
import { fetchCountryDialCodes } from '../../api/countryCodes.js';
import { DEFAULT_COMPANY_TIMEZONE } from '../../constants/company.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import CountryCodeCombobox from '../../components/ui/CountryCodeCombobox.jsx';
import CountryNameCombobox from '../../components/ui/CountryNameCombobox.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ChangePasswordSection from '../../components/auth/ChangePasswordSection.jsx';
import {
  nationalPhoneHint,
  trimPhoneToCountryLimit,
  validateNationalPhone,
} from '../../utils/inputFilters.js';

const EMPTY_FORM = {
  companyName: '',
  ownerName: '',
  countryCode: '+91',
  personalEmailId: '',
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
    companyName: profile.companyName || '',
    ownerName: profile.ownerName || '',
    countryCode: profile.countryCode || '+91',
    personalEmailId: profile.personalEmailId || '',
    phoneNumber: profile.phoneNumber || '',
    country: profile.country || '',
    state: profile.state || '',
    pinCode: profile.pinCode || '',
    fullAddress: profile.fullAddress || '',
  };
}

export default function AdminCompanyPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [dialCodes, setDialCodes] = useState([]);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profile, codes] = await Promise.all([
          getCompanyProfile(),
          fetchCountryDialCodes().catch(() => []),
        ]);
        if (cancelled) return;
        setForm(profileToForm(profile));
        setLogo(profile.companyProfilePicture);
        setDialCodes(codes);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
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

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCountryCodeSelect(option) {
    setForm((prev) => ({
      ...prev,
      countryCode: option.dialCode,
      country: option.countryName,
      phoneNumber: trimPhoneToCountryLimit(prev.phoneNumber, option.dialCode),
    }));
    setPhoneError('');
  }

  function handleCountrySelect(option) {
    setForm((prev) => ({
      ...prev,
      country: option.countryName,
      countryCode: option.dialCode,
      phoneNumber: trimPhoneToCountryLimit(prev.phoneNumber, option.dialCode),
    }));
    setPhoneError('');
  }

  async function handleSave(event) {
    event.preventDefault();
    const phoneCheck = validateNationalPhone(form.phoneNumber, form.countryCode);
    if (!phoneCheck.ok) {
      setPhoneError(phoneCheck.message);
      return;
    }
    setPhoneError('');
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        companyName: form.companyName.trim(),
        ownerName: form.ownerName.trim() || null,
        countryCode: form.countryCode || null,
        personalEmailId: form.personalEmailId.trim() || null,
        phoneNumber: form.phoneNumber.trim() || null,
        country: form.country.trim() || null,
        state: form.state.trim() || null,
        pinCode: form.pinCode.trim() || null,
        fullAddress: form.fullAddress.trim() || null,
        timezone: DEFAULT_COMPANY_TIMEZONE,
      };
      const updated = await updateCompanyProfile(payload);
      setForm(profileToForm(updated));
      setMessage('Company profile saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadCompanyProfilePicture(file);
      setLogo(updated.companyProfilePicture);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  const baseDialOptions =
    dialCodes.length > 0
      ? dialCodes
      : [{ id: 0, countryName: 'India', dialCode: '+91', isoCode: 'IN' }];

  function withCurrentOption(options, matchKey, currentValue, fallbackOption) {
    if (!currentValue || options.some((c) => c[matchKey] === currentValue)) {
      return options;
    }
    return [fallbackOption, ...options];
  }

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Company settings</h1>
      <ErrorMessage message={error} />
      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-card">
        {logo ? <img src={logo} alt="" className="h-16 w-16 rounded-xl object-cover" /> : null}
        <label className="cursor-pointer text-sm font-semibold text-primary">
          Upload logo
          <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-card">
        <TextField
          id="companyName"
          label="Company name"
          value={form.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          required
        />
        <TextField
          id="ownerName"
          label="Owner name"
          value={form.ownerName}
          inputFilter="alphabetic"
          onChange={(e) => updateField('ownerName', e.target.value)}
        />
        <TextField
          id="personalEmailId"
          label="Owner Email"
          type="email"
          value={form.personalEmailId}
          onChange={(e) => updateField('personalEmailId', e.target.value)}
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
            inputFilter="phone"
            phoneCountryCode={form.countryCode}
            inputMode="numeric"
            error={phoneError}
            onChange={(e) => {
              setPhoneError('');
              updateField('phoneNumber', e.target.value);
            }}
            hint={nationalPhoneHint(form.countryCode)}
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
            inputFilter="alphabetic"
            onChange={(e) => updateField('state', e.target.value)}
          />
        </div>

        <TextField
          id="pinCode"
          label="PIN / postal code"
          value={form.pinCode}
          inputFilter="numeric"
          inputMode="numeric"
          onChange={(e) => updateField('pinCode', e.target.value)}
        />

        <TextField
          id="fullAddress"
          label="Full address"
          value={form.fullAddress}
          onChange={(e) => updateField('fullAddress', e.target.value)}
        />

        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </form>

      <ChangePasswordSection />
    </div>
  );
}
