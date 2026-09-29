import { apiRequest } from './client.js';

function attendanceHeaders({ shiftKey, attendanceDate } = {}) {
  const headers = {};
  if (shiftKey) {
    headers['Shift-Key'] = shiftKey;
  }
  if (attendanceDate) {
    headers['Attendance-Date'] = attendanceDate;
  }
  return headers;
}

export function getTodayAttendance(options = {}) {
  return apiRequest('/api/attendance/me/today', {
    headers: attendanceHeaders(options),
  });
}

export function listMyAttendance(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  return apiRequest(`/api/attendance/me${qs}`);
}

export function confirmShift(body, options) {
  return apiRequest('/api/attendance/me/today/shifts/confirm', {
    method: 'POST',
    headers: attendanceHeaders(options),
    body: JSON.stringify(body || {}),
  });
}

export function submitShift(body, options) {
  return apiRequest('/api/attendance/me/today/shifts/submit', {
    method: 'PUT',
    headers: attendanceHeaders(options),
    body: JSON.stringify(body),
  });
}

export function updateShiftDetails(body, options) {
  return apiRequest('/api/attendance/me/today/shifts', {
    method: 'PATCH',
    headers: attendanceHeaders(options),
    body: JSON.stringify(body),
  });
}

export function getMyAttendanceRecord(params) {
  const search = new URLSearchParams(params).toString();
  return apiRequest(`/api/attendance/me/record?${search}`);
}

export function replyCommentThread(body) {
  return apiRequest('/api/attendance/me/shifts/comment-thread/reply', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function uploadWorkPictures(files, options) {
  const formData = new FormData();
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file) => {
    formData.append('workPictures', file);
  });
  return apiRequest('/api/attendance/me/today/shifts/work-pictures', {
    method: 'POST',
    headers: attendanceHeaders(options),
    body: formData,
  });
}

export function deleteWorkPictures(body, options) {
  return apiRequest('/api/attendance/me/today/shifts/work-pictures', {
    method: 'DELETE',
    headers: attendanceHeaders(options),
    body: JSON.stringify(body),
  });
}

export function replaceWorkPictures(files, removeUrls, options) {
  const formData = new FormData();
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file) => formData.append('workPictures', file));
  formData.append('removeUrls', JSON.stringify(removeUrls || []));
  return apiRequest('/api/attendance/me/today/shifts/work-pictures/replace', {
    method: 'PUT',
    headers: attendanceHeaders(options),
    body: formData,
  });
}
