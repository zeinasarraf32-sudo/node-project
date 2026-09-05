'use client';

import Link from 'next/link';
import { ChevronRight, Loader2, User } from 'lucide-react';
import { Appointment } from '@/interfaces/interfaces';

interface AppointmentHistoryProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export default function AppointmentHistory({
  appointments,
  isLoading,
}: AppointmentHistoryProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Appointment History
        </h2>

        <Link
          href="/appointment-confirmed"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No previous appointment history.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {appointments.map((item) => {
            const formattedDate = new Date(
              item.date
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const doctorImage = item.doctor?.imageUrl?.trim();

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {doctorImage ? (
                      <img
                        src={doctorImage}
                        alt={item.doctor.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {item.doctor.fullName}
                    </h4>

                    <p className="text-gray-400 text-xs truncate">
                      {item.doctor.specialty} · {formattedDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.status === 'CANCELLED'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}