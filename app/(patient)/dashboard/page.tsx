'use client';

import { useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';

import { axiosGet } from '@/lib/axios';
import { Appointment } from '@/interfaces/interfaces';

import UpcomingCard from '@/components/dashboard/UpcomingCard';
import QuickActions from '@/components/dashboard/QuickActions';
import AIBanner from '@/components/dashboard/AIBanner';
import AppointmentHistory from '@/components/dashboard/AppointmentHistory';
import RecommendedDoctors from '@/components/dashboard/RecommendedDoctors';
import NotificationsList from '@/components/dashboard/NotificationsList';

const emptySubscribe = () => () => {};

export default function DashboardPage() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const patientId = isClient
    ? localStorage.getItem('patientId') ||
      localStorage.getItem('userId') ||
      ''
    : '';

  const patientName = isClient
    ? localStorage.getItem('userName') ||
      localStorage.getItem('patientName') ||
      'Patient'
    : 'Patient';

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () =>
      axiosGet<Appointment[]>(
        `appointments?patientId=${encodeURIComponent(patientId)}`
      ),
    enabled: Boolean(patientId),
  });

  const appointments: Appointment[] =
    responseData?.data ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(
        appointment.date
      );

      appointmentDate.setHours(0, 0, 0, 0);

      const isUpcomingStatus =
        appointment.status === 'CONFIRMED' ||
        appointment.status === 'PENDING';

      return (
        isUpcomingStatus &&
        appointmentDate >= today
      );
    })
    .sort((a, b) => {
      const dateDifference =
        new Date(a.date).getTime() -
        new Date(b.date).getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return a.time.localeCompare(b.time);
    });

  const nextAppointment =
    upcomingAppointments[0] ?? null;

  const historyAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === 'COMPLETED' ||
        appointment.status === 'CANCELLED'
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 3);

  const formattedToday =
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

  return (
    <div className="space-y-8 pb-16 min-h-screen bg-slate-50/50 p-6 md:p-10">

      {/* Header */}
      <div>
        <p className="text-xs text-gray-400 font-medium">
          Good morning,
        </p>

        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          {patientName} 👋
        </h1>

        <p className="text-gray-500 text-xs mt-1">
          Here&apos;s your health overview for today,{' '}
          {formattedToday}
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-4 py-3 rounded-2xl">
          Failed to load your appointments.
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingCard
            appointment={nextAppointment}
            isLoading={isLoading}
          />

          <QuickActions />

          <AIBanner />

          <AppointmentHistory
            appointments={historyAppointments}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column */}
        <div className="grid grid-rows-2 gap-6 h-full">
          <RecommendedDoctors />

          <NotificationsList
            appointments={appointments}
          />
        </div>
      </div>
    </div>
  );
}