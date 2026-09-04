'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Appointment } from '@/interfaces/interfaces';

interface AppointmentHistoryProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export default function AppointmentHistory({ appointments, isLoading }: AppointmentHistoryProps) {
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
        <h2 className="text-base font-semibold text-gray-900">Appointment History</h2>
        <Link
          href="/appointment-confirmed"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No previous appointment history.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {appointments.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.doctor.imageUrl || '/default-doctor.png'}
                      alt={item.doctor.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.doctor.fullName}</h4>
                    <p className="text-gray-400 text-xs">
                      {item.doctor.specialty} · {formattedDate}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
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