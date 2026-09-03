'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
} from 'lucide-react';
import axios from 'axios';

interface AuthCardProps {
  handleLoginSuccess?: (
    email: string,
    mode?: 'signin' | 'signup'
  ) => void;
  initialTab?: 'signin' | 'signup';
}

export default function AuthCard({
  handleLoginSuccess,
  initialTab = 'signin',
}: AuthCardProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<'signin' | 'signup'>(initialTab);

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setErrorMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      /*
       * =========================
       * ADMIN LOGIN
       * =========================
       */

      if (cleanEmail === 'admin@gmail.com') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', 'authenticated');
        localStorage.setItem('role', 'admin');

        localStorage.removeItem('patientId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');

        router.push('/admin');

        return;
      }

      /*
       * =========================
       * SIGN UP
       * =========================
       */

      if (activeTab === 'signup') {
        if (!fullName.trim()) {
          setErrorMsg('Full name is required.');
          return;
        }

        const response = await axios.post('/api/auth/signup', {
          fullName: fullName.trim(),
          email: cleanEmail,
          password,
        });

        const patient = response.data?.patient;

        if (!patient) {
          throw new Error(
            'Account was created but patient data was not returned.'
          );
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'patient');
        localStorage.setItem('token', 'authenticated');

        localStorage.setItem(
          'patientId',
          String(patient.id)
        );

        localStorage.setItem(
          'userName',
          patient.fullName
        );

        localStorage.setItem(
          'userEmail',
          patient.email
        );

        if (handleLoginSuccess) {
          handleLoginSuccess(email, 'signup');
        } else {
          router.push('/profile');
        }

        return;
      }

      /*
       * =========================
       * SIGN IN
       * =========================
       */

      const response = await axios.post('/api/auth/login', {
        email: cleanEmail,
        password,
      });

      const patient = response.data?.patient;

      if (!patient) {
        throw new Error(
          'Login succeeded but patient data was not returned.'
        );
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'patient');

      localStorage.setItem(
        'token',
        response.data?.token || 'authenticated'
      );

      localStorage.setItem(
        'patientId',
        String(patient.id)
      );

      localStorage.setItem(
        'userName',
        patient.fullName
      );

      localStorage.setItem(
        'userEmail',
        patient.email
      );

      if (patient.phone) {
        localStorage.setItem(
          'userPhone',
          patient.phone
        );
      } else {
        localStorage.removeItem('userPhone');
      }

      if (handleLoginSuccess) {
        handleLoginSuccess(email, 'signin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);

      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message ||
            'An error occurred during authentication. Please try again.'
        );
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(
          'An error occurred during authentication. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setErrorMsg('');
    setPassword('');
  };

  return (
    <div className="auth-card">
      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="tab-container">
        <button
          type="button"
          onClick={() => switchTab('signin')}
          className={`tab-btn ${
            activeTab === 'signin'
              ? 'tab-btn-active'
              : 'tab-btn-inactive'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => switchTab('signup')}
          className={`tab-btn ${
            activeTab === 'signup'
              ? 'tab-btn-active'
              : 'tab-btn-inactive'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Google Auth Button */}
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          setErrorMsg(
            'Google sign-in is not available yet.'
          )
        }
        className="btn-social disabled:opacity-50"
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

      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-100 w-full" />

        <span className="bg-white px-3 text-xs text-gray-400 absolute font-medium">
          or continue with email
        </span>
      </div>

      <form
        onSubmit={handleAuth}
        className="space-y-4"
      >
        {/* Full Name - Sign Up only */}
        {activeTab === 'signup' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>

            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Ali Hassan"
                className="input-field pl-11"
              />
            </div>
          </div>
        )}

        {/* Email */}
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            Tip: use {"\"admin@gmail.com\""} for Admin Dashboard
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>

          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={
                showPassword ? 'text' : 'password'
              }
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              className="input-field pr-11"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        {activeTab === 'signin' && (
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-submit disabled:opacity-50"
        >
          {loading
            ? 'Processing...'
            : activeTab === 'signin'
              ? 'Sign In'
              : 'Create Account'}

          {!loading && (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}