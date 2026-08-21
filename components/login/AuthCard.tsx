'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthCardProps {
  handleLoginSuccess?: (email: string) => void;
}

export default function AuthCard({ handleLoginSuccess }: AuthCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = () => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === 'admin@gmail.com';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', 'authenticated');
    localStorage.setItem('role', isAdmin ? 'admin' : 'patient');

    if (handleLoginSuccess) {
      handleLoginSuccess(email);
    } else {
       // 3. توجيه افتراضي في حال عدم وجود دالة أب
       if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <div className="auth-card">
      {/* Tab Switcher */}
      <div className="tab-container">
        <button
          type="button"
          onClick={() => setActiveTab('signin')}
          className={`tab-btn ${activeTab === 'signin' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('signup')}
          className={`tab-btn ${activeTab === 'signup' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
        >
          Sign Up
        </button>
      </div>

      {/* Google Auth Button */}
      <button
        type="button"
        onClick={handleAuth}
        className="btn-social"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-100 w-full" />
        <span className="bg-white px-3 text-xs text-gray-400 absolute font-medium">
          or continue with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            Tip: use "admin@gmail.com" for Admin Dashboard
          </p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit">
          {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}