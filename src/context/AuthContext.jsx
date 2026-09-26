import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMe } from '../api/auth.js';
import { clearTokens, getAccessToken, setTokens } from '../utils/storage.js';
import { pickPrimaryMembership } from '../utils/membership.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((me) => {
    setUser(me);
    setMemberships(me?.memberships || []);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setMemberships([]);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function initSession() {
      const token = getAccessToken();
      if (!token) {
        clearSession();
        setLoading(false);
        return;
      }

      try {
        const me = await fetchMe({ signal: controller.signal });
        applySession(me);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        clearTokens();
        clearSession();
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    initSession();
    return () => controller.abort();
  }, [applySession, clearSession]);

  const loginWithTokens = useCallback(
    async (tokens) => {
      setTokens(tokens);
      setLoading(true);
      try {
        const me = await fetchMe();
        applySession(me);
        return me;
      } catch {
        clearTokens();
        clearSession();
        throw new Error('Could not load session after login');
      } finally {
        setLoading(false);
      }
    },
    [applySession, clearSession]
  );

  const logout = useCallback(() => {
    clearTokens();
    clearSession();
  }, [clearSession]);

  const refreshSession = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      clearSession();
      return;
    }
    const me = await fetchMe();
    applySession(me);
  }, [applySession, clearSession]);

  const primaryMembership = useMemo(
    () => pickPrimaryMembership(memberships),
    [memberships]
  );

  const value = useMemo(
    () => ({
      user,
      memberships,
      primaryMembership,
      loading,
      isAuthenticated: Boolean(user),
      loginWithTokens,
      logout,
      refreshSession,
    }),
    [
      user,
      memberships,
      primaryMembership,
      loading,
      loginWithTokens,
      logout,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
