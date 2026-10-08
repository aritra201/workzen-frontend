import { apiRequest, API_BASE } from './client.js';
import { getAccessToken } from '../utils/storage.js';

export function listPayroll(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  return apiRequest(`/api/payroll${qs}`);
}

export function listMyPayroll(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  return apiRequest(`/api/payroll/me${qs}`);
}

function filenameFromContentDisposition(header) {
  if (!header) {
    return null;
  }
  const match = /filename="([^"]+)"/i.exec(header);
  return match?.[1] ?? null;
}

/** Company payroll CSV (admin / member). Uses current filter params. */
export async function downloadPayrollCsv(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  const token = getAccessToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}/api/payroll/export${qs}`, { headers });
  if (!response.ok) {
    const text = await response.text();
    let message = `Export failed (${response.status})`;
    try {
      const data = JSON.parse(text);
      if (data?.message) {
        message = data.message;
      }
    } catch {
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const filename =
    filenameFromContentDisposition(response.headers.get('Content-Disposition')) ||
    'payroll-export.csv';
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
