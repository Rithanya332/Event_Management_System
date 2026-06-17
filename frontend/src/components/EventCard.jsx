import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const categoryColors = {
  Technical: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-purple-100 text-purple-700',
  Sports: 'bg-green-100 text-green-700',
  Academic: 'bg-yellow-100 text-yellow-700',
  Workshop: 'bg-orange-100 text-orange-700',
  Seminar: 'bg-teal-100 text-teal-700',
  Other: 'bg-gray-100 text-gray-700',
};

const categoryIcons = {
  Technical: '💻', Cultural: '🎭', Sports: '⚽', Academic: '📚', Workshop: '🔧', Seminar: '🎤', Other: '🎪',
};

const EventCard = ({ event }) => {
  const statusBadge = { upcoming: 'badge-upcoming', ongoing: 'badge-ongoing', past: 'badge-past', cancelled: 'badge-cancelled' };
  const spotsLeft = event.maxParticipants - (event.registrationCount || 0);

  return (
    <Link to={`/events/${event._id}`} className="card block overflow-hidden group animate-fade-in">
      {/* Image / Header */}
      <div className="relative h-44 gradient-bg flex items-center justify-center overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-6xl">{categoryIcons[event.category] || '🎪'}</span>
        )}
        <div className="absolute top-3 right-3">
          <span className={statusBadge[event.status]}>{event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}</span>
        </div>
        {event.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">⭐ Featured</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
            {categoryIcons[event.category]} {event.category}
          </span>
          {event.averageRating > 0 && (
            <span className="text-yellow-500 text-sm font-semibold">⭐ {event.averageRating}</span>
          )}
        </div>
        <h3 className="font-bold text-gray-800 text-lg mt-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{event.title}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.description}</p>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'TBD'} • {event.time}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-500">{event.registrationCount || 0}/{event.maxParticipants}</span>
          </div>
          <span className={`text-xs font-medium ${spotsLeft <= 10 ? 'text-red-500' : 'text-green-600'}`}>
            {event.status === 'past' ? 'Event Ended' : spotsLeft <= 0 ? 'Full' : `${spotsLeft} spots left`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
