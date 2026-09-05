'use client';

import {
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';
import {
  Heart,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Menu,
  X,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const token = isClient
    ? localStorage.getItem('token')
    : null;

  const authStatus = isClient
    ? localStorage.getItem('isLoggedIn') ===
      'true'
    : false;

  const isLoggedIn = Boolean(
    token || authStatus
  );

  const userName = isClient
    ? localStorage.getItem('userName') || ''
    : '';

  const userEmail = isClient
    ? localStorage.getItem('userEmail') || ''
    : '';

  const authNavItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'AI assistant',
      href: '/AIassistant',
    },
    {
      label: 'Find Doctors',
      href: '/doctors',
    },
    {
      label: 'My Appointments',
      href: '/appointment-confirmed',
    },
  ];

  const publicNavItems = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Find Doctors',
      href: '/doctors',
    },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('patientId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');

    setDropdownOpen(false);
    setMobileMenuOpen(false);

    router.push('/');
  };

  const isPublicPage =
    pathname === '/' ||
    pathname === '/login';

  const showAuthenticatedNav =
    isClient &&
    isLoggedIn &&
    !isPublicPage;

  const currentNavItems =
    showAuthenticatedNav
      ? authNavItems
      : publicNavItems;

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase() || 'P';

  return (
    <nav className="nav-header relative z-50">
      <div className="nav-container flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link
          href={
            showAuthenticatedNav
              ? '/dashboard'
              : '/'
          }
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>

          <span className="text-xl font-bold text-gray-900">
            Quick
            <span className="text-blue-600">
              Care
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
          {currentNavItems.map((item) => {
            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {showAuthenticatedNav ? (
            <div className="relative">

              {/* User Button */}
              <button
                type="button"
                onClick={() =>
                  setDropdownOpen(
                    !dropdownOpen
                  )
                }
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                {/* User Name */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900">
                    {userName || 'Patient'}
                  </p>

                  <p className="text-[11px] text-gray-400 font-medium">
                    Patient
                  </p>
                </div>

                {/* Initials */}
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>

                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2">

                  {/* User Information */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900">
                      Signed in as
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {userEmail ||
                        'No email available'}
                    </p>
                  </div>

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push(
                        '/profile'
                      );
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Patient Profile
                  </button>

                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Public User */
            <div className="hidden md:flex items-center gap-3">

              {/* Language */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span>عربي</span>
              </button>

              {/* Sign In */}
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-semibold text-xs transition px-2"
              >
                Sign In
              </Link>

              {/* Get Started */}
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-slate-100 rounded-xl transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {currentNavItems.map((item) => {
            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Public Navigation */}
          {!showAuthenticatedNav && (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block text-center py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50 rounded-xl"
              >
                Sign In
              </Link>

              <Link
                href="/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block text-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}