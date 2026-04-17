import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClasses = ({ isActive }) =>
    isActive
      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';

  return (
    <>
      {/* Mobile Top Header (Visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center">
          <div className="flex bg-indigo-50 p-1.5 rounded-lg text-indigo-600 mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
            UMS
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 py-1 flex justify-around items-center safe-area-pb">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {({ isActive }) => (
            <>
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-semibold">Dashboard</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {({ isActive }) => (
            <>
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-[10px] font-semibold">Users</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {({ isActive }) => (
            <>
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-semibold">Profile</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="hidden md:flex flex-col h-full bg-white border-r border-slate-200 shadow-sm z-10 w-64 shrink-0 transition-all">
        <div className="flex items-center justify-center h-20 border-b border-slate-100 px-6 shrink-0">
          <div className="flex bg-indigo-50 p-2 rounded-xl text-indigo-600 mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900 truncate">
            UMS
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu</div>
          
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            {({ isActive }) => (
              <>
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </>
            )}
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            {({ isActive }) => (
              <>
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                User Management
              </>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            {({ isActive }) => (
              <>
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center mb-4 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors border border-rose-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
