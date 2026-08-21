'use client';

import Link from 'next/link';
import { Brain, Calendar, FileText, Pill } from 'lucide-react';

const ACTIONS = [
  { label: 'AI Assistant', icon: Brain, bg: 'bg-blue-50', text: 'text-blue-600', href: '/AIassistant' },
  { label: 'Book Appointment', icon: Calendar, bg: 'bg-emerald-50', text: 'text-emerald-600', href: '/booking/1' },
  { label: 'My Appointments', icon: FileText, bg: 'bg-purple-50', text: 'text-purple-600', href: '/appointment-confirmed' },
  { label: 'Prescriptions', icon: Pill, bg: 'bg-amber-50', text: 'text-amber-600', href: '/profile' },
];

export default function QuickActions() {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ACTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition text-center group"
            >
              <div className={`p-3.5 rounded-2xl ${item.bg} ${item.text} group-hover:scale-105 transition`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}