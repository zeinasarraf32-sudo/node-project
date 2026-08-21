'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check, Calendar, Clock, MapPin } from 'lucide-react';

export default function AppointmentSuccessPage() {
  // Mock data matching your design screenshot
  const appointment = {
    doctorName: 'Dr. Sara Al-Halabi',
    specialty: 'Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    date: 'August 22, 2026',
    time: '5:00 PM',
    location: 'مستشفى الرمل، طرابلس',
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-sm border border-gray-100 text-center space-y-6">
        {/* Success Icon Badge */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
        </div>

        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Confirmed!</h1>
          <p className="text-sm text-gray-500">Your appointment has been successfully booked.</p>
        </div>

        {/* Appointment Card Details */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 text-left space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={appointment.avatar}
                alt={appointment.doctorName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{appointment.doctorName}</h3>
              <p className="text-xs text-blue-600 font-medium">{appointment.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{appointment.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/appointment-confirmed"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-sm flex items-center justify-center"
          >
            View My Appointments
          </Link>
          <Link
            href="/booking/2"
            className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition flex items-center justify-center"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}