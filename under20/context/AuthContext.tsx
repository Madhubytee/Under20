import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string, cookingLevel: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; cooking_level?: string }) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  updateProfile: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email: string, password: string, name: string, cookingLevel: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, cooking_level: cookingLevel },
        emailRedirectTo: 'under20://login-callback',
      },
    });
    return error ? error.message : null;
  };

  // scope: 'local' clears the session instantly without a network round-trip
  const signOut = async () => {
    await supabase.auth.signOut({ scope: 'local' });
  };

  const updateProfile = async (data: { name?: string; cooking_level?: string }): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ data });
    return error ? error.message : null;
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
