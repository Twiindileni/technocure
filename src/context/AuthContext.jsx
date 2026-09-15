import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    try {
      const p = await authService.getProfile(userId);
      setProfile(p);
    } catch (err) {
      console.error("[Auth] Failed to load profile:", err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session ?? null;
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    }).catch((err) => {
      console.warn("[Auth] Failed to restore session:", err?.message);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const role = profile?.role || "customer";
  const isAdmin      = ["admin", "manager"].includes(role);
  const isTechnician = role === "technician";

  const value = {
    user, profile, role, loading,
    isAdmin, isTechnician,
    isAuthenticated: !!user,
    refreshProfile: () => user && loadProfile(user.id),
    login:  (creds)  => authService.login(creds),
    logout: ()       => authService.logout(),
    register: (data) => authService.register(data),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
