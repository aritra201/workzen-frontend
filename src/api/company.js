import { apiRequest } from './client.js';

let profileCache = null;
let profileInflight = null;

export function invalidateCompanyProfileCache() {
  profileCache = null;
}

export function getCompanyProfile(options = {}) {
  const { fresh = false, ...requestOptions } = options;

  if (!fresh && profileCache) {
    return Promise.resolve(profileCache);
  }

  if (!fresh && profileInflight) {
    return profileInflight;
  }

  profileInflight = apiRequest('/api/company/', requestOptions)
    .then((data) => {
      profileCache = data;
      return data;
    })
    .finally(() => {
      profileInflight = null;
    });

  return profileInflight;
}

export function updateCompanyProfile(body) {
  return apiRequest('/api/company/', {
    method: 'PATCH',
    body: JSON.stringify(body),
  }).then((data) => {
    profileCache = data;
    return data;
  });
}

export function uploadCompanyProfilePicture(file) {
  const formData = new FormData();
  formData.append('companyProfilePicture', file);
  return apiRequest('/api/company/profile-picture', {
    method: 'POST',
    body: formData,
  }).then((data) => {
    profileCache = data;
    return data;
  });
}
