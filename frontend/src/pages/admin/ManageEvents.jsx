import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { eventAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await eventAPI.getAll(params);
      setEvents(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [search, category]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also remove all registrations.`)) return;
    try {
      await eventAPI.delete(id);
      setEvents(evs => evs.filter(e => e._id !== id));
      toast.success('Event deleted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  const statusColors = { upcoming: 'badge-upcoming', ongoing: 'badge-ongoing', past: 'badge-past', cancelled: 'badge-cancelled' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
            <p className="text-gray-500 mt-1">Create, edit and delete events</p>
          </div>
          <Link to="/admin/events/new" className="btn-primary">+ Create New Event</Link>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="input-field flex-1" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field sm:w-48">
            {['All','Technical','Cultural','Sports','Academic','Workshop','Seminar','Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : events.length === 0 ? (
          <div className="text-center py-16 card p-8">
            <p className="text-4xl mb-3">🎪</p>
            <p className="text-gray-500 mb-4">No events found.</p>
            <Link to="/admin/events/new" className="btn-primary">Create First Event</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['Event', 'Category', 'Date & Time', 'Location', 'Registrations', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-4 text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-800 max-w-xs truncate">{event.title}</div>
                        {event.isFeatured && <span className="text-xs text-yellow-600 font-medium">⭐ Featured</span>}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{event.category}</td>
                      <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                        {event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'N/A'}<br />
                        <span className="text-gray-400">{event.time}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{event.location}</td>
                      <td className="py-4 px-4 text-center font-semibold text-gray-700">{event.registrationCount || 0}/{event.maxParticipants}</td>
                      <td className="py-4 px-4"><span className={statusColors[event.status]}>{event.status}</span></td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Link to={`/events/${event._id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="View">👁️</Link>
                          <Link to={`/admin/events/${event._id}/edit`} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="Edit">✏️</Link>
                          <button onClick={() => handleDelete(event._id, event.title)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
