import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import StatCard from '../../components/StatCard';
import { eventAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#667eea','#764ba2','#f093fb','#f5576c','#4facfe','#43e97b','#fa709a'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventAPI.getStats().then(res => { setStats(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader text="Loading dashboard..." /></div>;

  const statCards = [
    { title: 'Total Events', value: stats?.totalEvents || 0, icon: '🎪', color: 'text-primary-600' },
    { title: 'Upcoming', value: stats?.upcomingEvents || 0, icon: '📅', color: 'text-blue-600' },
    { title: 'Ongoing', value: stats?.ongoingEvents || 0, icon: '🔴', color: 'text-green-600' },
    { title: 'Total Registrations', value: stats?.totalRegistrations || 0, icon: '👥', color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of all events and registrations</p>
          </div>
          <Link to="/admin/events/new" className="btn-primary flex items-center space-x-2">
            <span>+</span><span>Create Event</span>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(s => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Events by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.eventsByCategory || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#667eea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats?.eventsByCategory || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {(stats?.eventsByCategory || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/admin/events', icon: '🎪', label: 'Manage Events' },
            { to: '/admin/events/new', icon: '➕', label: 'Create Event' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users' },
            { to: '/admin/registrations', icon: '📋', label: 'Registrations' },
          ].map(link => (
            <Link key={link.to} to={link.to} className="card p-5 text-center hover:shadow-md transition-shadow group">
              <div className="text-3xl mb-2">{link.icon}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-primary-600">{link.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Registrations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Recent Registrations</h3>
            <Link to="/admin/registrations" className="text-primary-600 text-sm font-medium hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Student', 'Event', 'Date', 'Status'].map(h => <th key={h} className="text-left py-3 px-3 text-gray-500 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {(stats?.recentRegistrations || []).map(reg => (
                  <tr key={reg._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-700">{reg.user?.name}</td>
                    <td className="py-3 px-3 text-gray-600">{reg.event?.title}</td>
                    <td className="py-3 px-3 text-gray-500">{format(new Date(reg.registeredAt), 'MMM dd, yyyy')}</td>
                    <td className="py-3 px-3"><span className="badge-upcoming">{reg.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!stats?.recentRegistrations?.length) && <p className="text-center text-gray-400 py-6">No registrations yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
