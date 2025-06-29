import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Mail, Phone, School, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  school_id: string;
}

const ProfilePage: React.FC = () => {
  const { user, userRole } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
    school_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      if (userRole === 'super_admin') {
        // For super admin, we don't have additional profile data
        setProfile({
          first_name: '',
          last_name: '',
          phone: '',
          role: 'super_admin',
          school_id: '',
        });
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, phone, role, school_id')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data || {
          first_name: '',
          last_name: '',
          phone: '',
          role: '',
          school_id: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || userRole === 'super_admin') return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.first_name && profile.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.email
              }
            </h2>
            <p className="text-gray-600 capitalize">{profile.role?.replace('_', ' ')}</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} className="mr-2" />
            ) : (
              <AlertCircle size={20} className="mr-2" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {userRole !== 'super_admin' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={profile.first_name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={profile.last_name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.role?.replace('_', ' ').toUpperCase()}
                    disabled
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  icon={<Save size={18} />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}

          {userRole === 'super_admin' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                As a Super Administrator, your profile is managed separately from regular users. 
                Contact system administrators for any profile changes.
              </p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;