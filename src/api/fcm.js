import { apiRequest } from './client.js';

export function fetchFcmStatus(options) {
  return apiRequest('/api/fcm/status', { auth: true, ...options });
}

export function linkFcmSubscriber(subscriberId, token, options) {
  const body = {};
  if (subscriberId != null && subscriberId !== '') {
    body.subscriberId = subscriberId;
  }
  if (token && String(token).trim()) {
    body.token = String(token).trim();
  }
  return apiRequest('/api/fcm/link', {
    method: 'POST',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...options,
  });
}
