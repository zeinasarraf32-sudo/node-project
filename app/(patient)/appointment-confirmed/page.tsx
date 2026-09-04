'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Plus, X, Loader2 } from 'lucide-react';
import { axiosGet, axiosDelete } from '@/lib/axios';

interface Appointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  doctor: {
    id: number;
    fullName: string;
    specialty: string;
    imageUrl: string | null;
    location: string | null;
  };
}

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  const [patientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('patientId') || '9';
    }
    return '9';
  });

  // 1. Fetch Appointments
  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () => axiosGet<Appointment[]>(`appointments?patientId=${patientId}`),
    enabled: Boolean(patientId),
  });

  // 2. Mutation لحذف الموعد
  // 2. Mutation لحذف الموعد عبر المسار الديناميكي
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axiosDelete(`appointments/${id}`),
    onSuccess: () => {
      // إعادة جلب البيانات فوراً بعد الحذف لتحديث الواجهة تلقائياً
      queryClient.invalidateQueries({ queryKey: ['patient-appointments', patientId] });
    },
  });

  const appointments: Appointment[] = appointmentsData?.data || [];

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'CONFIRMED' || apt.status === 'PENDING'
  );
  const completedAppointments = appointments.filter((apt) => apt.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'CANCELLED');

  const displayedAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : [...completedAppointments, ...cancelledAppointments];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all your medical appointments</p>
          </div>
          <Link
            href="/doctors"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Book New
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</span>
            <p className="text-xs font-semibold text-gray-500 mt-1">Upcoming</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-emerald-600">{completedAppointments.length}</span>
            <p className="text-xs font-semibold text-gray-500 mt-1">Completed</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-rose-500">{cancelledAppointments.length}</span>
            <p className="text-xs font-semibold text-gray-500 mt-1">Cancelled</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'previous'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Previous ({completedAppointments.length + cancelledAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : displayedAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-medium">No appointments found in this section.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((apt) => {
              const formattedDate = new Date(apt.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={apt.doctor.imageUrl || '/default-doctor.png'}
                        alt={apt.doctor.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{apt.doctor.fullName}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-600'
                              : apt.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600'
                              : apt.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{apt.doctor.specialty}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {apt.time}
                        </span>
                        {apt.doctor.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {apt.doctor.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-xl transition">
                      View Details
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(apt.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition disabled:opacity-50"
                      title="Delete Appointment"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}