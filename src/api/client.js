import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/storage.js';

// Empty VITE_API_URL → same-origin `/api` (Vite dev proxy). Set full URL for production builds.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

let refreshPromise = null;

/** Concurrent identical GETs share one network call (e.g. React Strict Mode double effects). */
const inFlightGet = new Map();

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = await parseJsonSafe(response);
  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return true;
}

async function executeRequest(url, { auth, skipRefresh, headers, rest }) {
  let response = await fetch(url, { ...rest, headers });

  if (response.status === 401 && auth && !skipRefresh) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      const retryHeaders = new Headers(headers);
      retryHeaders.set('Authorization', `Bearer ${getAccessToken()}`);
      response = await fetch(url, { ...rest, headers: retryHeaders });
    }
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * @param {string} path - e.g. `/api/auth/me`
 * @param {RequestInit & { auth?: boolean, skipRefresh?: boolean, signal?: AbortSignal }} options
 */
export async function apiRequest(path, options = {}) {
  const {
    auth = true,
    skipRefresh = false,
    headers: customHeaders,
    signal,
    ...rest
  } = options;

  const method = (rest.method || 'GET').toUpperCase();
  const headers = new Headers(customHeaders || {});

  if (!headers.has('Content-Type') && rest.body && !(rest.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const fetchOptions = { ...rest, headers, signal };

  const canDedupe = method === 'GET' && !rest.body && !signal;

  if (canDedupe) {
    const key = `GET:${url}`;
    const existing = inFlightGet.get(key);
    if (existing) {
      return existing;
    }

    const promise = executeRequest(url, { auth, skipRefresh, headers, rest: fetchOptions }).finally(
      () => {
        inFlightGet.delete(key);
      }
    );
    inFlightGet.set(key, promise);
    return promise;
  }

  return executeRequest(url, { auth, skipRefresh, headers, rest: fetchOptions });
}

export { API_BASE };
