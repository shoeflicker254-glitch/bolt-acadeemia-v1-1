import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useIdleTimer } from '../hooks/useIdleTimer';
import IdleWarningModal from '../components/ui/IdleWarningModal';

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
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  // Idle timer configuration
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const WARNING_TIME = 5 * 60; // 5 minutes warning in seconds

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
        // Set default values if there's an error
        setUserRole('user');
        setSchoolId(null);
        return;
      }

      if (userProfile) {
        setUserRole(userProfile.role);
        setSchoolId(userProfile.school_id);
      } else {
        // User doesn't exist in users table, set default role
        setUserRole('user');
        setSchoolId(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set default values in case of any unexpected errors
      setUserRole('user');
      setSchoolId(null);
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
    setShowIdleWarning(false);
    await supabase.auth.signOut();
  };

  const handleIdleTimeout = () => {
    if (user) {
      setShowIdleWarning(true);
    }
  };

  const handleContinueSession = () => {
    setShowIdleWarning(false);
    // Reset the idle timer by triggering activity
    document.dispatchEvent(new Event('mousedown'));
  };

  const handleForceLogout = async () => {
    setShowIdleWarning(false);
    await signOut();
  };

  // Only set up idle timer if user is logged in
  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: handleIdleTimeout,
    events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'],
    element: user ? document : undefined
  });

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    userRole,
    schoolId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Idle Warning Modal */}
      <IdleWarningModal
        isOpen={showIdleWarning}
        onContinue={handleContinueSession}
        onLogout={handleForceLogout}
        warningTime={WARNING_TIME}
      />
    </AuthContext.Provider>
  );
};