import { apiRequest } from './client.js';

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
