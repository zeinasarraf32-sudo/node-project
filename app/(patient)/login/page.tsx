'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import AuthCard from '@/components/login/AuthCard';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <span className="text-2xl font-bold text-gray-900">
            Quick<span className="text-blue-600">Care</span>
          </span>
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome to QuickCare
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Sign in or create your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}