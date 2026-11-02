import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import {
  isFcmEnabledInBrowser,
  loadFcmScript,
  watchFcmSubscriberId,
  listenForFcmToken,
  syncWorkzenPushLink,
} from './workzenFcm.js';

/**
 * LawSikho fcm.js creates the FCM subscriber after notification permission.
 * WorkZen links that device to the logged-in user (token-only OK — backend registers on FCM).
 */
export default function FcmBootstrap() {
  const { isAuthenticated, user } = useAuth();
  const syncInFlight = useRef(false);

  const trySync = useCallback(async () => {
    if (!isAuthenticated || !user?._id || syncInFlight.current) {
      return;
    }
    syncInFlight.current = true;
    try {
      await syncWorkzenPushLink();
    } catch (err) {
      console.warn('[WorkZen FCM] sync failed:', err?.message || err);
    } finally {
      syncInFlight.current = false;
    }
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (!isFcmEnabledInBrowser()) {
      return undefined;
    }

    let stopWatch = () => {};
    let stopToken = () => {};

    (async () => {
      try {
        await loadFcmScript();
      } catch (err) {
        console.warn('[WorkZen FCM]', err?.message || err);
      }

      stopToken = listenForFcmToken(() => {
        void trySync();
      });

      stopWatch = watchFcmSubscriberId(() => {
        void trySync();
      });
    })();

    return () => {
      stopWatch();
      stopToken();
    };
  }, [isAuthenticated, user?._id, trySync]);

  useEffect(() => {
    if (!isFcmEnabledInBrowser() || !isAuthenticated || !user?._id) {
      return;
    }
    void trySync();
  }, [isAuthenticated, user?._id, trySync]);

  return null;
}
