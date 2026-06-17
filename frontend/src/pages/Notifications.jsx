import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const typeStyles = { success: 'bg-green-50 border-green-200 text-green-700', info: 'bg-blue-50 border-blue-200 text-blue-700', warning: 'bg-yellow-50 border-yellow-200 text-yellow-700' };
const typeIcons = { success: '✅', info: 'ℹ️', warning: '⚠️' };

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getNotifications(user.id).then(res => { setNotifications(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user.id]);

  const markRead = async (notifId) => {
    await userAPI.markNotificationRead(user.id, notifId);
    setNotifications(ns => ns.map(n => n._id === notifId ? { ...n, read: true } : n));
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🔔 Notifications</h1>
        {notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n._id} onClick={() => !n.read && markRead(n._id)}
                className={`card p-4 border flex items-start space-x-3 cursor-pointer ${typeStyles[n.type] || typeStyles.info} ${!n.read ? 'opacity-100' : 'opacity-70'}`}>
                <span className="text-xl flex-shrink-0">{typeIcons[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{n.message}</p>
                  <p className="text-xs opacity-70 mt-0.5">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
