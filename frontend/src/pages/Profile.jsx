import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { userAPI, registrationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: '', department: '', year: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, regRes] = await Promise.all([userAPI.getOne(user.id), userAPI.getRegistrations(user.id)]);
        const p = profileRes.data.data;
        setForm({ name: p.name, phone: p.phone || '', department: p.department || '', year: p.year || '' });
        setRegistrations(regRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user.id]);

  const handleUpdate = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await userAPI.updateProfile(user.id, form);
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match!'); return; }
    setSaving(true);
    try {
      await userAPI.changePassword(user.id, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Change password failed.'); }
    finally { setSaving(false); }
  };

  const handleCancelReg = async (regId) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await registrationAPI.cancel(regId);
      setRegistrations(regs => regs.filter(r => r._id !== regId));
      toast.success('Registration cancelled.');
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed.'); }
  };

  const statusColors = { confirmed: 'badge-upcoming', waitlisted: 'bg-yellow-100 text-yellow-700', cancelled: 'badge-cancelled' };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card overflow-hidden">
          {/* Profile header */}
          <div className="gradient-bg p-8 text-white flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="opacity-90">{user?.email}</p>
              <span className="mt-1 inline-block bg-white/20 px-3 py-0.5 rounded-full text-sm font-medium capitalize">{user?.role}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            {[{ id: 'profile', label: '👤 Profile' }, { id: 'registrations', label: `🎟️ My Events (${registrations.length})` }, { id: 'password', label: '🔒 Security' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'profile' && (
              <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                <div className="sm:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label><input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label><input name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+91 9876543210" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label><input name="department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                  <select name="year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="input-field">
                    <option value="">Select Year</option>
                    {['1st Year','2nd Year','3rd Year','4th Year','PG 1st Year','PG 2nd Year'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button></div>
              </form>
            )}

            {tab === 'registrations' && (
              <div>
                {registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🎪</p>
                    <p className="text-gray-500">No event registrations yet.</p>
                    <Link to="/dashboard" className="btn-primary inline-block mt-4">Browse Events</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map(reg => (
                      <div key={reg._id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white text-xl">🎪</div>
                          <div>
                            <p className="font-semibold text-gray-800">{reg.event?.title}</p>
                            <p className="text-xs text-gray-500">{reg.event?.date ? format(new Date(reg.event.date), 'MMM dd, yyyy') : ''} • {reg.event?.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[reg.status] || ''}`}>{reg.status}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${reg.event?.status === 'upcoming' ? 'badge-upcoming' : reg.event?.status === 'ongoing' ? 'badge-ongoing' : 'badge-past'}`}>{reg.event?.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Link to={`/events/${reg.event?._id}`} className="text-xs text-primary-600 font-medium hover:underline">View Event</Link>
                          {reg.event?.status === 'upcoming' && reg.status === 'confirmed' && (
                            <button onClick={() => handleCancelReg(reg._id)} className="text-xs text-red-500 hover:underline">Cancel</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-sm">
                {[{label:'Current Password',key:'currentPassword'},{label:'New Password',key:'newPassword'},{label:'Confirm New Password',key:'confirmPassword'}].map(f => (
                  <div key={f.key}><label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                  <input type="password" value={pwForm[f.key]} onChange={e => setPwForm({...pwForm, [f.key]: e.target.value})} required className="input-field" /></div>
                ))}
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Changing...' : 'Change Password'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
