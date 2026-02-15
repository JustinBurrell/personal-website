import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth as useWorkOSAuth } from '@workos-inc/authkit-react';
import { fetchAuthMe } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user: workosUser, getAccessToken, isLoading: workosLoading, signIn, signOut } = useWorkOSAuth();
  const [adminState, setAdminState] = useState({ isAdmin: false, checked: false });

  const refreshAdminState = useCallback(async (retries = 2) => {
    if (!getAccessToken) {
      setAdminState({ isAdmin: false, checked: true });
      return;
    }
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await fetchAuthMe(getAccessToken);
        if (data) {
          setAdminState({ isAdmin: data.isAdmin ?? false, checked: true });
          return;
        }
        // null response (non-200) — retry after delay if attempts remain
      } catch {
        // Network error (backend cold start, CORS, etc.) — retry
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
    // All retries exhausted
    setAdminState({ isAdmin: false, checked: true });
  }, [getAccessToken]);

  useEffect(() => {
    if (!workosUser) {
      setAdminState({ isAdmin: false, checked: true });
      return;
    }
    refreshAdminState();
  }, [workosUser, refreshAdminState]);

  const isLoading = workosLoading || (workosUser && !adminState.checked);
  const user = workosUser
    ? {
        id: workosUser.id,
        email: workosUser.email,
        firstName: workosUser.firstName,
        lastName: workosUser.lastName,
      }
    : null;
  const isAdmin = adminState.isAdmin;

  const value = {
    user,
    isAdmin,
    isLoading,
    signIn,
    signOut,
    getAccessToken,
    refreshAdminState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
