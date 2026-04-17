import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      updateUser(response.data || response.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      const respData = error.response?.data;
      if (respData?.message === 'Validation failed' && respData?.meta?.errors?.length > 0) {
        toast.error(respData.meta.errors[0].message);
      } else {
        toast.error(respData?.message || 'Failed to update profile');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="mt-2 text-slate-300 text-lg">Manage your account settings and preferences.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10">
           <svg className="w-64 h-64 -translate-y-10 translate-x-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50">
          <nav className="flex px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600 bg-white shadow-sm rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-lg'
              } w-1/2 py-4 px-1 text-center border-b-2 font-semibold text-sm transition-all duration-200 mt-2`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-indigo-500 text-indigo-600 bg-white shadow-sm rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-t-lg'
              } w-1/2 py-4 px-1 text-center border-b-2 font-semibold text-sm transition-all duration-200 mt-2`}
            >
              Security Settings
            </button>
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileUpdate} className="max-w-2xl">
              <div className="flex items-center mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-indigo-200">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="ml-6 space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{user.email}</p>
                  <div className="pt-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                      user.role === 'admin' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      user.role === 'manager' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="max-w-xl">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
              </div>
              
              <div className="space-y-5">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  error={errors.currentPassword}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  error={errors.newPassword}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  required
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
                    Update Password
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
