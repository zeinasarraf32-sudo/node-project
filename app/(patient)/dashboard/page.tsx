'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { axiosGet } from '@/lib/axios';
import { Appointment } from '@/interfaces/interfaces';

import UpcomingCard from '@/components/dashboard/UpcomingCard';
import QuickActions from '@/components/dashboard/QuickActions';
import AIBanner from '@/components/dashboard/AIBanner';
import AppointmentHistory from '@/components/dashboard/AppointmentHistory';
import HealthSummary from '@/components/dashboard/HealthSummary';
import RecommendedDoctors from '@/components/dashboard/RecommendedDoctors';
import NotificationsList from '@/components/dashboard/NotificationsList';

export default function DashboardPage() {
  const [patientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('patientId') || '9';
    }
    return '9';
  });

  const [patientName, setPatientName] = useState<string>('Patient');

  // جلب اسم المريض من localStorage إن وجد
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('patientName') || localStorage.getItem('userName');
      if (storedName) {
        setPatientName(storedName);
      }
    }
  }, []);

  // Fetching real appointments data from DB
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () => axiosGet<any>(`appointments?patientId=${patientId}`),
    enabled: Boolean(patientId),
  });

  // حماية الاستجابة واستخراج Array دائماً
  const rawData = responseData?.data;
  const appointments: Appointment[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.appointments)
    ? rawData.appointments
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  // Filter Upcoming & History
  const upcomingAppointments = appointments.filter(
    (apt) => apt?.status === 'CONFIRMED' || apt?.status === 'PENDING'
  );
  const nextAppointment = upcomingAppointments[0] || null;

  // في حال وجود موعد وقادرين على قراءة اسم المريض منه، نقوم بتحديث الاسم
  const displayName =
    (nextAppointment as any)?.patient?.fullName ||
    (nextAppointment as any)?.patientName ||
    patientName;

  const historyAppointments = appointments
    .filter((apt) => apt?.status === 'COMPLETED' || apt?.status === 'CANCELLED')
    .slice(0, 3);

  const formattedToday = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16 min-h-screen bg-slate-50/50 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Good morning,</p>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {displayName} 👋
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Here's your health overview for today, {formattedToday}
          </p>
        </div>
        <button className="p-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 hover:text-gray-700 transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingCard appointment={nextAppointment} isLoading={isLoading} />
          <QuickActions />
          <AIBanner />
          <AppointmentHistory appointments={historyAppointments} isLoading={isLoading} />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <HealthSummary />
          <RecommendedDoctors />
          <NotificationsList />
        </div>
      </div>
    </div>
  );
}