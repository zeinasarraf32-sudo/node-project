'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, User, LogOut, ChevronDown, Globe } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(authStatus);
  }, [pathname]);

  const authNavItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'My Appointments', href: '/appointment-confirmed' },
  ];

  const publicNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/doctors' },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <nav className="nav-header">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link href={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Quick<span className="text-blue-600">Care</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-pill-container">
          {(isLoggedIn ? authNavItems : publicNavItems).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side Controls */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="nav-profile-btn"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900">Ali Hassan</p>
                <p className="text-[11px] text-gray-400 font-medium">Patient</p>
              </div>
              <div className="nav-avatar-badge">AH</div>
              <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
            </button>

            {dropdownOpen && (
              <div className="dropdown-card">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900">Signed in as</p>
                  <p className="text-xs text-gray-500 truncate">ali.hassan@example.com</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/profile');
                  }}
                  className="dropdown-menu-item text-gray-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Patient Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="dropdown-menu-item text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button className="btn-lang-select">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>عربي</span>
            </button>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-semibold text-sm transition"
            >
              Sign In
            </Link>
            <Link href="/login" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}