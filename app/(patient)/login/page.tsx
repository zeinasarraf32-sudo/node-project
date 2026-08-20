import { Heart } from 'lucide-react';
import AuthCard from '@/components/login/AuthCard';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-slate-50 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">QuickCare</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm">Sign in to manage your health appointments</p>
      </div>

      {/* Auth Card Component */}
      <AuthCard />

      {/* Footer Switcher */}
      <p className="text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <button className="text-blue-600 font-semibold hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}