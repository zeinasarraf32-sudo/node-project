'use client';

import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import { Doctor } from './DoctorSelector';

interface BookingSummaryProps {
  doctor: Doctor;
  selectedDate: number | null;
  selectedTime: string | null;
  patientName: string;
  insuranceDiscount: number;
  onConfirm: () => void;
}

export default function BookingSummary({
  doctor,
  selectedDate,
  selectedTime,
  patientName,
  insuranceDiscount,
  onConfirm,
}: BookingSummaryProps) {
  const totalDue = doctor.fee - insuranceDiscount;
  const isReadyToBook = selectedDate !== null && selectedTime !== null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>

      {/* Doctor Info */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={doctor.avatar}
            alt={doctor.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{doctor.name}</h3>
          <p className="text-xs text-blue-600 font-medium">{doctor.specialty}</p>
        </div>
      </div>

      {/* Appointment Meta Details */}
      <div className="space-y-3 text-sm pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Date</span>
          </div>
          <span className={`font-medium ${selectedDate ? 'text-gray-900' : 'text-gray-300'}`}>
            {selectedDate ? `Aug ${selectedDate}, 2026` : 'Not selected'}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Time</span>
          </div>
          <span className={`font-medium ${selectedTime ? 'text-gray-900' : 'text-gray-300'}`}>
            {selectedTime || 'Not selected'}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Location</span>
          </div>
          <span className="font-medium text-gray-900 text-xs">{doctor.location}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>Patient</span>
          </div>
          <span className="font-semibold text-gray-900">{patientName}</span>
        </div>
      </div>

      {/* Price Calculation */}
      <div className="space-y-2 text-sm pt-1">
        <div className="flex items-center justify-between text-gray-600">
          <span>Consultation Fee</span>
          <span className="font-semibold text-gray-900">${doctor.fee}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-600">
          <span>Insurance Coverage</span>
          <span className="font-semibold">-${insuranceDiscount}</span>
        </div>
        <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
          <span>Total Due</span>
          <span className="text-blue-600">${totalDue}</span>
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={!isReadyToBook}
          onClick={onConfirm}
          className={`w-full py-3.5 px-4 rounded-xl font-bold transition text-sm ${
            isReadyToBook
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              : 'bg-blue-200 text-white cursor-not-allowed'
          }`}
        >
          Confirm Appointment
        </button>
        <p className="text-center text-xs text-gray-400 font-medium">
          Free cancellation up to 24h before appointment
        </p>
      </div>
    </div>
  );
}