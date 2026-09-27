import { apiRequest } from './client.js';

export function listEmployees() {
  return apiRequest('/api/employees/');
}

/** Public: active employees with linked accounts — id, name, email for dropdowns. */
export function listEmployeeDropdown(companyId) {
  const search = new URLSearchParams({ companyId }).toString();
  return apiRequest(`/api/employees/dropdown?${search}`, { auth: false });
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
