import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const getWelcomeMessage = () => {
    if (hasRole('admin')) {
      return 'Welcome, Administrator';
    } else if (hasRole('manager')) {
      return 'Welcome, Manager';
    } else {
      return 'Welcome';
    }
  };

  const getRoleColor = () => {
    if (hasRole('admin')) return 'bg-red-100 text-red-800';
    if (hasRole('manager')) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getStats = () => {
    if (hasRole('admin')) {
      return [
        { label: 'Total Users', value: '150', color: 'bg-blue-500' },
        { label: 'Active Users', value: '120', color: 'bg-green-500' },
        { label: 'Managers', value: '25', color: 'bg-purple-500' },
        { label: 'Pending Requests', value: '5', color: 'bg-yellow-500' },
      ];
    } else if (hasRole('manager')) {
      return [
        { label: 'Team Members', value: '45', color: 'bg-blue-500' },
        { label: 'Active Projects', value: '12', color: 'bg-green-500' },
        { label: 'Completed Tasks', value: '89', color: 'bg-purple-500' },
      ];
    } else {
      return [
        { label: 'Profile Completion', value: '85%', color: 'bg-blue-500' },
        { label: 'Tasks Assigned', value: '8', color: 'bg-green-500' },
        { label: 'Completed', value: '5', color: 'bg-purple-500' },
      ];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">{getWelcomeMessage()}</h1>
          <p className="mt-2 text-indigo-100 text-lg">
            Here's what's happening with your account today.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-sm font-medium">Your Role:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-indigo-900 shadow-sm">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform opacity-20">
           <svg width="404" height="384" fill="none" viewBox="0 0 404 384"><defs><pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"></rect></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {getStats().map((stat, index) => (
          <div key={index} className="bg-white hover-lift rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color.split('-')[1]}-50 to-${stat.color.split('-')[1]}-100`}>
                <svg className={`h-6 w-6 text-${stat.color.split('-')[1]}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {index === 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> 
                  : index === 1 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hasRole('admin') && (
              <>
                <button 
                  onClick={() => navigate('/users')}
                  className="group flex flex-col items-start p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 transition-all text-left bg-white"
                >
                  <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="mt-4 text-slate-900 font-semibold">Create New User</span>
                  <span className="mt-1 text-xs text-slate-500">Onboard a new team member</span>
                </button>
                <button className="group flex flex-col items-start p-5 border border-slate-200 rounded-xl hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 transition-all text-left bg-white">
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="mt-4 text-slate-900 font-semibold">View Reports</span>
                  <span className="mt-1 text-xs text-slate-500">Analyze user activity & stats</span>
                </button>
              </>
            )}
            {(hasRole('admin') || hasRole('manager')) && (
              <button 
                onClick={() => navigate('/users')}
                className="group flex flex-col items-start p-5 border border-slate-200 rounded-xl hover:border-purple-500 hover:ring-1 hover:ring-purple-500 transition-all text-left bg-white"
              >
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="mt-4 text-slate-900 font-semibold">Manage Users</span>
                <span className="mt-1 text-xs text-slate-500">Edit and organize accounts</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/profile')}
              className="group flex flex-col items-start p-5 border border-slate-200 rounded-xl hover:border-amber-500 hover:ring-1 hover:ring-amber-500 transition-all text-left bg-white"
            >
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="mt-4 text-slate-900 font-semibold">View Profile</span>
              <span className="mt-1 text-xs text-slate-500">Update your personal info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
