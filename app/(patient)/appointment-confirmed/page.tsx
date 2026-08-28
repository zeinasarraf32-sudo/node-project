'use client';

import Link from "next/link";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '@/components/appointment/StatCard';
import AppointmentCard, { Appointment } from '@/components/appointment/AppointmentCard';
import FloatingWidgets from '@/components/appointment/FloatingWidgets';
import EmptyState from '@/components/ui/EmptyState'; // 👈 استيراد مكون الـ UI

const appointmentsData: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sara Al-Halabi',
    specialty: 'Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    status: 'Confirmed',
    date: 'Mon, Aug 7, 2026',
    time: '10:00 AM',
    location: 'مستشفى الرمل، طرابلس',
    type: 'in-person',
  },
  {
    id: '2',
    doctorName: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    avatar: 'https://images.unsplash.com/photo-1594824813571-2153349aed06?w=150',
    status: 'Pending',
    date: 'Wed, Aug 14, 2026',
    time: '2:30 PM',
    location: 'Telehealth',
    type: 'telehealth',
  },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
        Back to Home
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your medical appointments</p>
        </div>
        <Link
          href="/booking/1"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Book New
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard count={2} label="Upcoming" colorClass="text-blue-600" />
        <StatCard count={8} label="Completed" colorClass="text-emerald-500" />
        <StatCard count={2} label="Cancelled" colorClass="text-red-500" />
      </div>

      <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'upcoming'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming (2)
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'previous'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Previous (0)
        </button>
      </div>

      {/* عرض البيانات أو حالة القائمة الفارغة شرطياً */}
      <div className="space-y-4">
        {activeTab === 'upcoming' ? (
          appointmentsData.map((item) => (
            <AppointmentCard key={item.id} appointment={item} />
          ))
        ) : (
          <EmptyState 
            title="No Previous Appointments" 
            description="You have no past completed or cancelled appointments recorded yet." 
          />
        )}
      </div>

      <FloatingWidgets />
    </div>
  );
}