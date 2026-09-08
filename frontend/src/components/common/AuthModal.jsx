import { useState } from 'react';
import { X, Eye, EyeOff, ShoppingBag, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const PANEL = { LOGIN: 'login', REGISTER: 'register', FORGOT: 'forgot' };

export default function AuthModal({ isOpen, onClose }) {
  const [panel, setPanel] = useState(PANEL.LOGIN);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
  });

  const { login, register } = useAuthStore();

  if (!isOpen) return null;

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirm: '' });
    setError('');
    setShowPass(false);
  };

  const switchPanel = (p) => { setPanel(p); resetForm(); };

  const handleClose = () => { resetForm(); setPanel(PANEL.LOGIN); onClose(); };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Real Async Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);

    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name || 'User'}! 👋`);
      handleClose();
    } else {
      setError(result.error);
    }
  };

  // Real Async Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);

    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success(`Account created! Welcome to ToyAlfa, ${result.user.name || 'User'}! 🎉`);
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset link sent to your email!');
      switchPanel(PANEL.LOGIN);
    }, 900);
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition placeholder:text-gray-400';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 px-6 pt-6 pb-5 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/80 transition"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ToyAlfa</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {panel === PANEL.LOGIN    && 'Sign In to your account'}
            {panel === PANEL.REGISTER && 'Create a new account'}
            {panel === PANEL.FORGOT   && 'Reset your password'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {panel === PANEL.LOGIN && 'Enter your credentials to access your account.'}
            {panel === PANEL.REGISTER && 'Fill in the form to get started.'}
            {panel === PANEL.FORGOT   && 'We\'ll send a reset link to your email.'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {panel === PANEL.LOGIN && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    className={`${inputCls} pl-9 pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => switchPanel(PANEL.FORGOT)} className="text-xs text-rose-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
              </button>
              <p className="text-center text-xs text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchPanel(PANEL.REGISTER)} className="text-rose-600 font-semibold hover:underline">
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {panel === PANEL.REGISTER && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={update('name')}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min 6 chars"
                      value={form.password}
                      onChange={update('password')}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Repeat"
                      value={form.confirm}
                      onChange={update('confirm')}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" onChange={() => setShowPass(!showPass)} className="accent-rose-500" />
                Show passwords
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={15} /></>}
              </button>
              <p className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => switchPanel(PANEL.LOGIN)} className="text-rose-600 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {panel === PANEL.FORGOT && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Remember it?{' '}
                <button type="button" onClick={() => switchPanel(PANEL.LOGIN)} className="text-rose-600 font-semibold hover:underline">
                  Back to Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}