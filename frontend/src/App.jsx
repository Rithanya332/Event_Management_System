import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import EventRegistration from './pages/EventRegistration';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import EventForm from './pages/admin/EventForm';
import ManageUsers from './pages/admin/ManageUsers';
import AllRegistrations from './pages/admin/AllRegistrations';
import Notifications from './pages/Notifications';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' } }} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
          <Route path="/events/:id/register" element={<PrivateRoute><EventRegistration /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><ManageEvents /></AdminRoute>} />
          <Route path="/admin/events/new" element={<AdminRoute><EventForm /></AdminRoute>} />
          <Route path="/admin/events/:id/edit" element={<AdminRoute><EventForm /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/registrations" element={<AdminRoute><AllRegistrations /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
