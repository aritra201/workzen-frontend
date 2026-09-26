import { apiRequest } from './client.js';

export function listExtraShifts(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  return apiRequest(`/api/extra-shifts${qs}`);
}

export function declareExtraShift(body) {
  return apiRequest('/api/extra-shifts/declare', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
