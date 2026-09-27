import { apiRequest } from './client.js';

export function listMembers(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val != null && val !== '') {
      search.set(key, String(val));
    }
  });
  const qs = search.toString();
  return apiRequest(qs ? `/api/members/?${qs}` : '/api/members/');
}

export function inviteMember(body) {
  return apiRequest('/api/members/invitations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function resendMemberInvite(body) {
  return apiRequest('/api/members/invitations/resend', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateMemberStatus(memberId, body) {
  return apiRequest(`/api/members/${memberId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function getMyMemberProfile() {
  return apiRequest('/api/members/me');
}

export function updateMyMemberProfile(body) {
  return apiRequest('/api/members/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function uploadMyMemberProfilePicture(file) {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return apiRequest('/api/members/me/profile-picture', {
    method: 'POST',
    body: formData,
  });
}
