import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other'];
const STATUSES = ['All', 'upcoming', 'ongoing', 'past'];

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      const res = await eventAPI.getAll(params);
      setEvents(res.data.data);
      setPagination({ pages: res.data.pages, total: res.data.total, current: res.data.currentPage });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, status, page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSearch = e => { setSearch(e.target.value); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="opacity-90 text-lg">Discover and register for exciting campus events</p>
          {/* Search */}
          <div className="mt-6 max-w-2xl relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={handleSearch} placeholder="Search events by name, description, location..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg text-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-600 self-center">Category:</span>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'gradient-bg text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-600 self-center">Status:</span>
            {STATUSES.map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${status === s ? 'gradient-bg text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-5">
            Showing <span className="font-semibold text-gray-700">{events.length}</span> of <span className="font-semibold text-gray-700">{pagination.total || 0}</span> events
          </p>
        )}

        {/* Events Grid */}
        {loading ? <Loader text="Loading events..." /> : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎪</p>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg font-medium ${page === p ? 'gradient-bg text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
