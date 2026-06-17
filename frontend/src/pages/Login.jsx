import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
      if (result.message?.toLowerCase().includes('not found') || result.message?.toLowerCase().includes('register')) {
        setTimeout(() => navigate('/register'), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12">
        <div className="text-white text-center">
          <div className="text-8xl mb-6">🎓</div>
          <h1 className="text-4xl font-bold mb-4">College Event Management</h1>
          <p className="text-xl opacity-90 mb-8">Your one-stop platform for campus events</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {['Browse Events', 'Easy Registration', 'Email Notifications', 'Track History'].map(f => (
              <div key={f} className="bg-white/20 rounded-xl p-4">
                <p className="font-semibold">✅ {f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">C</div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="input-field" placeholder="you@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="input-field" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>Sign In →</span>}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register here</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2">🔑 Demo Credentials:</p>
            <p className="text-xs text-blue-600">Admin: admin@college.edu / admin123</p>
            <p className="text-xs text-blue-600">Student: student@college.edu / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
