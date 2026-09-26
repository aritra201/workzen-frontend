import { apiRequest } from './client.js';

export function getActivityLogListItems(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data.items)) {
    return data.items;
  }
  if (Array.isArray(data.logs)) {
    return data.logs;
  }
  if (Array.isArray(data.records)) {
    return data.records;
  }
  return [];
}

export function formatActivityActionType(actionType) {
  if (!actionType) {
    return 'Activity';
  }
  return String(actionType)
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatActivityActorRole(role) {
  if (!role) {
    return '';
  }
  return String(role)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Email · Role (for list rows). */
export function formatActivityActorLine(log) {
  const parts = [];
  if (log?.actorEmail) {
    parts.push(log.actorEmail);
  }
  if (log?.actorRole) {
    parts.push(formatActivityActorRole(log.actorRole));
  }
  return parts.length ? parts.join(' · ') : 'System';
}

export function formatActivityFieldLabel(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatActivityFieldValue(key, value) {
  if (value == null || value === '') {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  const keyLower = String(key).toLowerCase();
  if (
    (keyLower.includes('at') || keyLower.endsWith('_date') || keyLower === 'date') &&
    typeof value === 'string' &&
    !Number.isNaN(Date.parse(value))
  ) {
    const d = new Date(value);
    if (keyLower === 'date' && value.length === 10) {
      return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
    }
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
  if (keyLower.includes('status') && typeof value === 'string') {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (keyLower.includes('shift') && typeof value === 'string') {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

const HIDE_WHEN_EMAIL_PRESENT = {
  verified_by: 'verified_by_email',
  declared_by: 'declared_by_email',
  approved_by: 'approved_by_email',
  decided_by: 'decided_by_email',
};

const EMAIL_FIELD_LABELS = {
  verified_by_email: 'Verified by',
  declared_by_email: 'Declared by',
  approved_by_email: 'Approved by',
  decided_by_email: 'Decided by',
};

export function activityLogObjectEntries(record) {
  if (record == null) {
    return [];
  }
  if (typeof record !== 'object' || Array.isArray(record)) {
    return [{ key: 'value', label: 'Value', value: formatActivityFieldValue('value', record) }];
  }

  const skipKeys = new Set();
  for (const [rawKey, emailKey] of Object.entries(HIDE_WHEN_EMAIL_PRESENT)) {
    if (record[emailKey]) {
      skipKeys.add(rawKey);
    }
  }
  for (const key of Object.keys(record)) {
    if (key.endsWith('_email') && key !== 'verified_by_email' && !EMAIL_FIELD_LABELS[key]) {
      skipKeys.add(key);
    }
  }

  return Object.entries(record)
    .filter(([key]) => !skipKeys.has(key))
    .map(([key, value]) => {
      const label = EMAIL_FIELD_LABELS[key] ?? formatActivityFieldLabel(key);
      const displayValue =
        key.endsWith('_email') && value
          ? String(value)
          : formatActivityFieldValue(key, value);
      return { key, label, value: displayValue };
    })
    .filter((row) => row.value !== '—' || !String(row.key).endsWith('_email'));
}

export function listActivityLogsForAttendance(attendanceId) {
  const qs = new URLSearchParams({ attendanceId: String(attendanceId) }).toString();
  return apiRequest(`/api/activity-logs?${qs}`);
}

export function getActivityLogDetail(activityLogId) {
  return apiRequest(
    `/api/activity-logs/record?activityLogId=${encodeURIComponent(activityLogId)}`
  );
}
