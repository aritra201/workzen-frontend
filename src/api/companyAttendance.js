import { apiRequest } from './client.js';

const listCache = new Map();
const listInflight = new Map();

function listPathFromQuery(query) {
  const search = new URLSearchParams(query).toString();
  return search ? `/api/company-attendance/?${search}` : '/api/company-attendance/';
}

export function invalidateCompanyAttendanceListCache() {
  listCache.clear();
}

export function listCompanyAttendance(params = {}) {
  const { signal, fresh, ...query } = params;
  const path = listPathFromQuery(query);

  if (!fresh && listCache.has(path)) {
    return Promise.resolve(listCache.get(path));
  }

  if (!fresh && listInflight.has(path)) {
    return listInflight.get(path);
  }

  const promise = apiRequest(path, { signal })
    .then((data) => {
      listCache.set(path, data);
      return data;
    })
    .finally(() => {
      listInflight.delete(path);
    });

  listInflight.set(path, promise);
  return promise;
}

export function getCompanyAttendanceRecord(params) {
  const search = new URLSearchParams(params).toString();
  return apiRequest(`/api/company-attendance/record?${search}`);
}

export function verifyShift(body) {
  return apiRequest('/api/company-attendance/shifts/verify', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((data) => {
    invalidateCompanyAttendanceListCache();
    return data;
  });
}

export function adminReplyCommentThread(body) {
  return apiRequest('/api/company-attendance/shifts/comment-thread/reply', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((data) => {
    invalidateCompanyAttendanceListCache();
    return data;
  });
}
