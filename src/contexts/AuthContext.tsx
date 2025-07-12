import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userRole: string | null;
  schoolId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserRole(null);
        setSchoolId(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First check if user is a super admin using maybeSingle() to avoid PGRST116 error
      const { data: superAdmin, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (superAdminError) {
        console.error('Error checking super admin status:', superAdminError);
      }

      if (superAdmin) {
        setUserRole('super_admin');
        setSchoolId(null);
        return;
      }

      // If not super admin, check regular users table
      // Use maybeSingle() here as well to handle cases where user might not exist
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('role, school_id')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        // Check if this might be a super admin by email
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user?.email === 'demo@acadeemia.com' || authUser.user?.email === 'superadmin@acadeemia.com') {
          setUserRole('super_admin');
          setSchoolId(null);
        } else {
          setUserRole('user');
          setSchoolId(null);
        }
        return;
      }

      if (userProfile) {
        setUserRole(userProfile.role);
        setSchoolId(userProfile.school_id);
      } else {
        // User doesn't exist in users table, check if it's a known super admin
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user?.email === 'demo@acadeemia.com' || authUser.user?.email === 'superadmin@acadeemia.com') {
          setUserRole('super_admin');
          setSchoolId(null);
        } else {
          setUserRole('user');
          setSchoolId(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Check if this might be a super admin by email in case of unexpected errors
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user?.email === 'demo@acadeemia.com' || authUser.user?.email === 'superadmin@acadeemia.com') {
        setUserRole('super_admin');
        setSchoolId(null);
      } else {
        setUserRole('user');
        setSchoolId(null);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      setSchoolId(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear local state even if there's an error
      setUser(null);
      setSession(null);
      setUserRole(null);
      setSchoolId(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    userRole,
    schoolId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};