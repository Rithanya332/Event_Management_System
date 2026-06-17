import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { registrationAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    registrationAPI.getAll().then(res => { setRegistrations(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = registrations.filter(r =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkAttend = async (id) => {
    try {
      await registrationAPI.markAttendance(id);
      setRegistrations(regs => regs.map(r => r._id === id ? { ...r, attended: true } : r));
      toast.success('Attendance marked!');
    } catch (err) { toast.error('Failed.'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Registrations</h1>
            <p className="text-gray-500 mt-1">Total: {registrations.length} registrations</p>
          </div>
        </div>
        <div className="card p-4 mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student, event or email..." className="input-field max-w-md" />
        </div>
        {loading ? <Loader /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['Student', 'Email', 'Event', 'Date', 'Status', 'Attended', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-4 text-gray-500 font-semibold">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(reg => (
                    <tr key={reg._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold text-gray-700">{reg.user?.name || reg.name}</td>
                      <td className="py-4 px-4 text-gray-600">{reg.email}</td>
                      <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{reg.event?.title}</td>
                      <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{format(new Date(reg.registeredAt), 'MMM dd, yyyy')}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${reg.status === 'confirmed' ? 'bg-green-100 text-green-700' : reg.status === 'waitlisted' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{reg.status}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${reg.attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{reg.attended ? '✅ Yes' : '—'}</span>
                      </td>
                      <td className="py-4 px-4">
                        {!reg.attended && <button onClick={() => handleMarkAttend(reg._id)} className="text-xs text-primary-600 font-medium hover:underline">Mark Present</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No registrations found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRegistrations;
