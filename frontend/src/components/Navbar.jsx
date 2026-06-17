import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      userAPI.getNotifications(user.id).then(res => {
        setUnreadCount(res.data.data.filter(n => !n.read).length);
      }).catch(() => {});
    }
  }, [user, location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const navLinks = isAdmin
    ? [
        { to: '/dashboard', label: '🏠 Home' },
        { to: '/admin', label: '📊 Admin' },
        { to: '/admin/events', label: '🎯 Events' },
        { to: '/admin/users', label: '👥 Users' },
        { to: '/admin/registrations', label: '📋 Registrations' },
      ]
    : [
        { to: '/dashboard', label: '🏠 Dashboard' },
        { to: '/profile', label: '👤 Profile' },
      ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-lg">C</div>
            <span className="font-bold text-gray-800 hidden sm:block">College Events</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  location.pathname === link.to ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-none">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>

            <button onClick={handleLogout}
              className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-500 hover:text-primary-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg mt-1">
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg mt-1">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
