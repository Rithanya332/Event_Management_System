import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student', phone: '', department: '', year: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match!'); return; }
    const { confirmPassword, ...data } = form;
    const result = await register(data);
    if (result.success) {
      toast.success('Account created successfully! 🎉');
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">C</div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Join the College Event Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="input-field" placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="input-field" placeholder="Repeat password" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
              <input name="department" value={form.department} onChange={handleChange} className="input-field" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className="input-field">
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'student', label: '🎓 Student', desc: 'Browse and register for events' }, { val: 'admin', label: '⚙️ Admin/Organizer', desc: 'Create and manage events' }].map(r => (
                  <label key={r.val} className={`flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.role === r.val ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="role" value={r.val} checked={form.role === r.val} onChange={handleChange} className="mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">{r.label}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>Create Account →</span>}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
