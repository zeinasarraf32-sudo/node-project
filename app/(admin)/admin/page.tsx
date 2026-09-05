'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import StatCard from '@/components/admin/StatCard';
import RecentAppointments from '@/components/admin/RecentAppointments';
import SpecialtyDistribution from '@/components/admin/SpecialtyDistribution';
import AppointmentTrends from '@/components/admin/AppointmentTrends';
import DoctorWorkload from '@/components/admin/DoctorWorkload';
import DoctorsTable from '@/components/admin/DoctorsTable';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import PatientsList from '@/components/admin/PatientsList';

import { axiosGet } from '@/lib/axios';
import { IDoctor } from '@/interfaces/interfaces';

interface Patient {
  id: number;
  fullName: string;
}

interface AdminAppointment {
  id: number;
  date: string;
  time: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED';
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'doctors' | 'appointments' | 'patients'
  >('overview');

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axiosGet<Patient[]>('patients');
      return response.data || [];
    },
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['admin-doctors-stats'],
    queryFn: async () => {
      const response = await axiosGet<IDoctor[]>('doctors');
      return response.data || [];
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response =
        await axiosGet<AdminAppointment[]>('appointments');

      return response.data || [];
    },
  });

  const today = new Date();

  const isToday = (date: string) => {
    const appointmentDate = new Date(date);

    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate()
    );
  };

  const todayAppointments = appointments.filter((appointment) =>
    isToday(appointment.date)
  );

  const completedToday = todayAppointments.filter(
    (appointment) => appointment.status === 'COMPLETED'
  );

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(today);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            QuickCare Platform Overview — {formattedDate}
          </p>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => router.push('/admin/doctors/add')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            + Add Doctor
          </button>
        </div>
      </div>

      {/* Real Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Patients"
          value={patients.length.toLocaleString()}
          icon={
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Doctors"
          value={doctors.length.toLocaleString()}
          icon={
            <svg
              className="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length.toLocaleString()}
          icon={
            <svg
              className="w-5 h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <StatCard
          title="Completed Today"
          value={completedToday.length.toLocaleString()}
          icon={
            <svg
              className="w-5 h-5 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium text-slate-600">
        {(
          [
            'overview',
            'doctors',
            'appointments',
            'patients',
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-white font-semibold text-slate-800 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AppointmentTrends />
            </div>

            <div>
              <SpecialtyDistribution />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DoctorWorkload />
            <RecentAppointments />
          </div>
        </>
      )}

      {activeTab === 'doctors' && <DoctorsTable />}

      {activeTab === 'appointments' && (
        <AppointmentsTable />
      )}

      {activeTab === 'patients' && <PatientsList />}
    </div>
  );
}