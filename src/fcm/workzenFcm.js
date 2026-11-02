import { linkFcmSubscriber } from '../api/fcm.js';

const TOKEN_STORAGE_KEYS = ['fcm_token', 'FCM_TOKEN', 'firebase_token', 'firebaseToken', 'ls_device_token'];

const SUBSCRIBER_STORAGE_KEYS = [
  'fcm_subscriber_id',
  'subscriberId',
  'subscriber_id',
  'FCMSubscriberId',
];

export function isFcmEnabledInBrowser() {
  return import.meta.env.VITE_FCM_ENABLED !== 'false' && Boolean(import.meta.env.VITE_FCM_SCRIPT_URL);
}

export function getStoredFcmSubscriberId() {
  for (const key of SUBSCRIBER_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw && /^\d+$/.test(String(raw).trim())) {
        return Number(String(raw).trim());
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function getStoredFcmToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw && String(raw).trim().length > 20) {
        return String(raw).trim();
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function loadFcmScript() {
  if (!isFcmEnabledInBrowser()) {
    return Promise.resolve(false);
  }
  if (document.querySelector('script[data-workzen-fcm-script]')) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = import.meta.env.VITE_FCM_SCRIPT_URL;
    script.async = true;
    script.dataset.workzenFcmScript = '1';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load FCM script'));
    document.head.appendChild(script);
  });
}

/** Sync push with WorkZen after login — uses token (+ optional subscriber id from fcm.js). */
export async function syncWorkzenPushLink() {
  const token = getStoredFcmToken();
  const subscriberId = getStoredFcmSubscriberId();
  if (!token && !subscriberId) {
    return { skipped: true, reason: 'no_token_yet' };
  }
  return linkFcmSubscriber(subscriberId ?? undefined, token || undefined);
}

export function watchFcmSubscriberId(onSubscriberId) {
  const seen = new Set();

  const tick = () => {
    const id = getStoredFcmSubscriberId();
    if (id && !seen.has(id)) {
      seen.add(id);
      onSubscriberId(id);
    }
  };

  tick();
  const interval = setInterval(tick, 2000);
  const onStorage = (event) => {
    if (!event.key || SUBSCRIBER_STORAGE_KEYS.includes(event.key) || TOKEN_STORAGE_KEYS.includes(event.key)) {
      tick();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    clearInterval(interval);
    window.removeEventListener('storage', onStorage);
  };
}

export function listenForFcmToken(onToken) {
  const handler = (event) => {
    const token = event?.detail?.token;
    if (token && String(token).length > 20) {
      onToken(String(token));
    }
  };
  window.addEventListener('fcm-token', handler);
  return () => window.removeEventListener('fcm-token', handler);
}
