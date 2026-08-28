'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSelector, { Doctor } from '@/components/booking/DoctorSelector';
import DatePicker from '@/components/booking/DatePicker';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import BookingSummary from '@/components/booking/BookingSummary';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sara Al-Halabi',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviewsCount: 312,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    fee: 35,
    location: 'مستشفى الرمل، طرابلس',
  },
  {
    id: '2',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    rating: 4.8,
    reviewsCount: 278,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    fee: 40,
    location: 'مستشفى الرمل، طرابلس',
  },
  {
    id: '3',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    rating: 4.9,
    reviewsCount: 445,
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a9c2018243?w=150&auto=format&fit=crop&q=80',
    fee: 30,
    location: 'مستشفى الرمل، طرابلس',
  },
];

export default function BookingPage() {
  const router = useRouter();
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(MOCK_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [symptomsReason, setSymptomsReason] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    
    router.push('/appointment-success');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Book an Appointment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select a doctor, choose a date and time, and confirm your appointment.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Flow Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Doctor Selector */}
            <DoctorSelector
              doctors={MOCK_DOCTORS}  
              selectedDoctorId={selectedDoctor.id}
              onSelect={setSelectedDoctor}
            />

            {/* Step 2: Date Picker */}
            <DatePicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Step 3: Time Slot Selector */}
            <TimeSlotSelector
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />

            {/* Step 4: Reason for Visit */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <h2 className="text-lg font-bold text-gray-900">Reason for Visit</h2>
              </div>
              <textarea
                rows={3}
                value={symptomsReason}
                onChange={(e) => setSymptomsReason(e.target.value)}
                placeholder="Describe your main symptoms or reason for this appointment..."
                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Right Floating Sidebar Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              doctor={selectedDoctor}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              patientName="Ali Hassan"
              insuranceDiscount={15}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}