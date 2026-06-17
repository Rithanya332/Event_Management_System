import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { eventAPI, registrationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    eventAPI.getOne(id).then(res => { setEvent(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await eventAPI.delete(id);
      toast.success('Event deleted!');
      navigate('/admin/events');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  const handleFeedback = async e => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await eventAPI.addFeedback(id, feedback);
      toast.success('Feedback submitted! Thank you 🌟');
      const res = await eventAPI.getOne(id);
      setEvent(res.data.data);
      setFeedback({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Feedback failed.'); }
    finally { setSubmittingFeedback(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader text="Loading event..." /></div>;
  if (!event) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20 text-gray-500">Event not found.</div></div>;

  const spotsLeft = event.maxParticipants - (event.registrationCount || 0);
  const isPast = event.status === 'past';
  const hasReviewed = event.feedback?.some(f => f.user?._id === user.id || f.user === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link> &gt; <span className="text-gray-700">{event.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event header card */}
            <div className="card overflow-hidden">
              <div className="h-56 gradient-bg flex items-center justify-center">
                {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  : <span className="text-8xl">🎪</span>}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700`}>{event.category}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : event.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
                {event.averageRating > 0 && (
                  <div className="flex items-center space-x-1 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(event.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}
                    <span className="text-sm text-gray-500 ml-1">{event.averageRating} ({event.feedback?.length} reviews)</span>
                  </div>
                )}
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Feedback section */}
            {isPast && !hasReviewed && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Rate This Event</h3>
                <form onSubmit={handleFeedback} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setFeedback(f => ({...f, rating: s}))}
                          className={`text-3xl transition-transform hover:scale-110 ${s <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                    <textarea value={feedback.comment} onChange={e => setFeedback(f => ({...f, comment: e.target.value}))}
                      className="input-field" rows={3} placeholder="Share your experience..." />
                  </div>
                  <button type="submit" disabled={submittingFeedback} className="btn-primary">
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews */}
            {event.feedback?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Reviews ({event.feedback.length})</h3>
                <div className="space-y-4">
                  {event.feedback.map((f, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-700">{f.user?.name || 'User'}</span>
                        <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={s <= f.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</div>
                      </div>
                      {f.comment && <p className="text-gray-600 text-sm">{f.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event info */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">Event Details</h3>
              <div className="space-y-3">
                {[
                  { icon: '📅', label: 'Date', value: format(new Date(event.date), 'EEEE, MMM dd, yyyy') },
                  { icon: '⏰', label: 'Time', value: event.time },
                  { icon: '📍', label: 'Location', value: event.location },
                  { icon: '🏷️', label: 'Category', value: event.category },
                  { icon: '👥', label: 'Capacity', value: `${event.registrationCount || 0} / ${event.maxParticipants}` },
                  { icon: '👤', label: 'Organizer', value: event.organizer?.name },
                ].map(item => (
                  <div key={item.label} className="flex items-start space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      <p className="text-sm text-gray-700 font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity bar */}
            <div className="card p-6">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>Registration Progress</span>
                <span>{Math.round(((event.registrationCount || 0) / event.maxParticipants) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="gradient-bg h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((event.registrationCount || 0) / event.maxParticipants) * 100, 100)}%` }} />
              </div>
              <p className={`text-sm mt-2 font-medium ${spotsLeft <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                {spotsLeft <= 0 ? 'Event is Full!' : `${spotsLeft} spots remaining`}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {!isAdmin && !isPast && (
                <Link to={`/events/${id}/register`} className="btn-primary w-full text-center block py-3">
                  🎟️ Register Now
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link to={`/admin/events/${id}/edit`} className="btn-secondary w-full text-center block py-3">✏️ Edit Event</Link>
                  <button onClick={handleDelete} className="btn-danger w-full py-3">🗑️ Delete Event</button>
                  <Link to={`/admin/registrations`} className="block text-center text-primary-600 text-sm font-medium hover:underline">View All Registrations →</Link>
                </>
              )}
              <Link to="/dashboard" className="block text-center text-gray-500 text-sm hover:text-gray-700">← Back to Events</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
