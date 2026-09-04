'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { Appointment } from '@/interfaces/interfaces';

interface UpcomingCardProps {
  appointment: Appointment | null;
  isLoading: boolean;
}

export default function UpcomingCard({ appointment, isLoading }: UpcomingCardProps) {
  if (isLoading) {
    return (
      <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-center min-h-[180px] shadow-lg">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-blue-600 rounded-3xl p-8 text-white text-center space-y-4 shadow-lg">
        <p className="font-semibold text-blue-100">No upcoming appointments scheduled</p>
        <Link
          href="/doctors"
          className="inline-block bg-white text-blue-600 px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-50 transition"
        >
          Book an Appointment
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-90">Upcoming Appointment</span>
        <span className="bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full font-semibold">
          Next
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 bg-white/10">
          <Image
            src={appointment.doctor.imageUrl || '/default-doctor.png'}
            alt={appointment.doctor.fullName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">{appointment.doctor.fullName}</h3>
          <p className="text-blue-100 text-sm font-medium">{appointment.doctor.specialty}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="bg-white/15 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="bg-white/15 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {appointment.time}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/appointment-confirmed"
          className="flex-1 bg-white hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-2xl text-sm transition text-center"
        >
          View Details
        </Link>
        <Link
          href="/doctors"
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-2xl text-sm transition text-center"
        >
          Reschedule
        </Link>
      </div>
    </div>
  );
}