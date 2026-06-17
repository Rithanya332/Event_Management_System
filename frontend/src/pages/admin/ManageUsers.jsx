import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { userAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userAPI.getAll().then(res => { setUsers(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await userAPI.deleteUser(id);
      setUsers(us => us.filter(u => u._id !== id));
      toast.success('User deleted!');
    } catch (err) { toast.error('Delete failed.'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <p className="text-gray-500 mt-1">View and manage registered users</p>
        </div>
        <div className="card p-4 mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field max-w-md" />
        </div>
        {loading ? <Loader /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['User', 'Email', 'Role', 'Department', 'Year', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-4 text-gray-500 font-semibold">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-700">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{u.department || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{u.year || '-'}</td>
                      <td className="py-4 px-4 text-gray-500">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                      <td className="py-4 px-4">
                        <button onClick={() => handleDelete(u._id, u.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No users found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
