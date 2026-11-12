import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { login, register, navigateTo, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('muskansharm546@gmail.com');
  const [password, setPassword] = useState('HappyBites@2026');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email, email.includes('admin') ? 'admin' : 'customer');
      navigateTo('home');
    } else if (mode === 'register') {
      if (!name.trim()) return;
      register(name, email, phone);
      navigateTo('home');
    } else {
      showToast(`Password reset link sent to ${email}`, 'success');
      setMode('login');
    }
  };

  const handleQuickDemoCustomer = () => {
    setEmail('muskansharm546@gmail.com');
    login('muskansharm546@gmail.com', 'customer');
    navigateTo('home');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@happybites.com');
    login('admin@happybites.com', 'admin');
    navigateTo('admin');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 py-8">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md bg-[#FFF8F0] mx-auto">
            <img
              src="/assets/aistudio/happy_bites_logo_6b2fcaa4.png"
              alt="Happy Bites Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-[#2C1810] font-heading">
            {mode === 'login'
              ? 'Welcome to Happy Bites'
              : mode === 'register'
              ? 'Join Happy Bites'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Sign in to access your orders, saved addresses & coupons'
              : mode === 'register'
              ? 'Create an account to enjoy 30-min snack delivery'
              : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-stone-600">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-xl transition ${
                mode === 'login'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-xl transition ${
                mode === 'register'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muskan Sharma"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                />
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mobile Phone *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-stone-700">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-orange-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500 focus:bg-white font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 pt-2.5"
          >
            <span>
              {mode === 'login'
                ? 'Sign In to Happy Bites'
                : mode === 'register'
                ? 'Create My Account'
                : 'Send Password Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'forgot' && (
          <button
            onClick={() => setMode('login')}
            className="w-full text-center text-xs text-orange-600 font-bold hover:underline"
          >
            &larr; Back to Sign In
          </button>
        )}

        {/* 1-Click Demo Logins for instant review */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <p className="text-[10px] uppercase font-bold text-stone-400 text-center tracking-wider">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleQuickDemoCustomer}
              className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold transition text-center"
            >
              Demo Customer
            </button>
            <button
              onClick={handleQuickDemoAdmin}
              className="py-2 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold transition text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
