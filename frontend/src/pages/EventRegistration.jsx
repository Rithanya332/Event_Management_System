import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { eventAPI, registrationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EventRegistration = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', department: '', year: '', rollNumber: '', additionalInfo: '' });

  useEffect(() => {
    eventAPI.getOne(id).then(res => { setEvent(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await registrationAPI.register({ eventId: id, ...form });
      toast.success(res.data.message);
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader text="Loading..." /></div>;
  if (!event) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="text-center py-20 text-gray-500">Event not found.</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link> &gt;{' '}
          <Link to={`/events/${id}`} className="hover:text-primary-600">{event.title}</Link> &gt;{' '}
          <span className="text-gray-700">Register</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Registration</h1>
              <p className="text-gray-500 mb-6">Fill in your details to register for this event</p>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <input name="department" value={form.department} onChange={handleChange} className="input-field" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                  <select name="year" value={form.year} onChange={handleChange} className="input-field">
                    <option value="">Select Year</option>
                    {['1st Year','2nd Year','3rd Year','4th Year','PG 1st Year','PG 2nd Year'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roll Number</label>
                  <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className="input-field" placeholder="e.g. CS2021001" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Information</label>
                  <textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange}
                    className="input-field" rows={3} placeholder="Any special requirements or queries..." />
                </div>
                <div className="sm:col-span-2 flex gap-4">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3 flex items-center justify-center">
                    {submitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Registering...</>
                      : '🎟️ Confirm Registration'}
                  </button>
                  <Link to={`/events/${id}`} className="btn-secondary px-6 py-3">Cancel</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Event Summary */}
          <div className="card p-6 h-fit">
            <h3 className="font-bold text-gray-800 mb-4">Event Summary</h3>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary-600 text-lg">{event.title}</h4>
              {[
                { icon: '🏷️', label: event.category },
                { icon: '📅', label: format(new Date(event.date), 'MMM dd, yyyy') },
                { icon: '⏰', label: event.time },
                { icon: '📍', label: event.location },
              ].map(item => (
                <div key={item.label} className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{item.icon}</span><span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">📧 A confirmation email will be sent to your registered email address after successful registration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
