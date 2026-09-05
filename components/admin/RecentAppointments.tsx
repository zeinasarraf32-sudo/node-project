'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosGet } from '@/lib/axios';

type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface Appointment {
  id: number;
  date: string;
  time: string;
  createdAt: string;
  status: AppointmentStatus;

  patient: {
    id: number;
    fullName: string;
  };

  doctor: {
    id: number;
    fullName: string;
    specialty: string;
  };
}

const statusStyles: Record<AppointmentStatus, string> = {
  CONFIRMED: 'bg-blue-50 text-blue-600',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  PENDING: 'bg-amber-50 text-amber-600',
  CANCELLED: 'bg-rose-50 text-rose-600',
};

function formatStatus(status: AppointmentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(date: string, time: string) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

  return `${formattedDate}, ${time}`;
}

export default function RecentAppointments() {
  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response =
        await axiosGet<Appointment[]>('appointments');

      return response.data || [];
    },
  });

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex items-center justify-center text-xs text-slate-400">
        Loading recent appointments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex items-center justify-center text-xs text-rose-500">
        Failed to load recent appointments.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 text-sm">
          Recent Appointments
        </h3>

        <span className="text-[10px] text-slate-400">
          Latest {recentAppointments.length}
        </span>
      </div>

      {recentAppointments.length === 0 ? (
        <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-400">
            No appointments available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {appointment.patient.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {appointment.patient.fullName}
                  </p>

                  <p className="text-[11px] text-slate-400 truncate">
                    Dr. {appointment.doctor.fullName} •{' '}
                    {formatDate(
                      appointment.date,
                      appointment.time
                    )}
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  statusStyles[appointment.status]
                }`}
              >
                {formatStatus(appointment.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}