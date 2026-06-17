import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'Technical', description: '', date: '', endDate: '', time: '',
    location: '', maxParticipants: 100, registrationDeadline: '', image: '', tags: '', isFeatured: false,
  });

  useEffect(() => {
    if (isEdit) {
      eventAPI.getOne(id).then(res => {
        const e = res.data.data;
        setForm({
          title: e.title, category: e.category, description: e.description,
          date: e.date ? e.date.split('T')[0] : '',
          endDate: e.endDate ? e.endDate.split('T')[0] : '',
          time: e.time, location: e.location, maxParticipants: e.maxParticipants,
          registrationDeadline: e.registrationDeadline ? e.registrationDeadline.split('T')[0] : '',
          image: e.image || '', tags: e.tags?.join(', ') || '', isFeatured: e.isFeatured,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (isEdit) { await eventAPI.update(id, payload); toast.success('Event updated!'); }
      else { await eventAPI.create(payload); toast.success('Event created!'); }
      navigate('/admin/events');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;

  const categories = ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/admin/events" className="hover:text-primary-600">Events</Link> &gt; <span className="text-gray-700">{isEdit ? 'Edit Event' : 'Create Event'}</span>
        </nav>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? '✏️ Edit Event' : '➕ Create New Event'}</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="input-field" placeholder="e.g. Annual Tech Symposium 2024" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location *</label>
              <input name="location" value={form.location} onChange={handleChange} required className="input-field" placeholder="e.g. Main Auditorium, Block A" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Time *</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Deadline</label>
              <input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Participants</label>
              <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} min={1} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="e.g. hackathon, coding, prizes" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                className="input-field" placeholder="Describe the event in detail..." />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold text-gray-700">⭐ Mark as Featured Event</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center">
                {saving ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Saving...</>
                  : (isEdit ? '💾 Update Event' : '🚀 Create Event')}
              </button>
              <Link to="/admin/events" className="btn-secondary px-8 py-3">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
