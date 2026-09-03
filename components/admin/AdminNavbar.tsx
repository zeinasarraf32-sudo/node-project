'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Bell, Globe, ChevronDown, LogOut } from 'lucide-react';

export default function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        
        {/* اللوجو واسم التطبيق */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-200">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-base font-bold text-slate-800">
            Quick<span className="text-blue-600">Care</span>
          </span>
        </div>

        {/* شارة اللوحة */}
        <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-lg border border-blue-100">
          Admin Dashboard
        </div>

        {/* الأدوات اليمنى */}
        <div className="flex items-center gap-3.5">
          {/* زر اختيار اللغة */}
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>عربي</span>
          </button>

          {/* التنبيهات */}
          <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {/* القائمة المنسدلة للـ Admin */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer focus:outline-none p-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                A
              </div>
              <span className="text-xs font-semibold text-slate-700">Admin</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50/50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}