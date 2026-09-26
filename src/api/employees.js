import { apiRequest } from './client.js';

export function listEmployees() {
  return apiRequest('/api/employees/');
}

export function listPresentEmployees(params = {}) {
  const search = new URLSearchParams(params).toString();
  const qs = search ? `?${search}` : '';
  return apiRequest(`/api/employees/present${qs}`);
}

export function inviteEmployee(body) {
  return apiRequest('/api/employees/invitations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function resendEmployeeInvite(body) {
  return apiRequest('/api/employees/invitations/resend', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateEmployeeStatus(employeeId, body) {
  return apiRequest(`/api/employees/${employeeId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function getMyEmployeeProfile() {
  return apiRequest('/api/employees/me');
}

export function updateMyEmployeeProfile(body) {
  return apiRequest('/api/employees/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function uploadMyEmployeeProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return apiRequest('/api/employees/me/profile-picture', {
    method: 'POST',
    body: formData,
  });
}
