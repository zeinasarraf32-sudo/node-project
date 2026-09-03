'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSelector, { Doctor } from '@/components/booking/DoctorSelector';
import DatePicker from '@/components/booking/DatePicker';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import BookingSummary from '@/components/booking/BookingSummary';

export default function BookingPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(params);
  const routeDoctorId = resolvedParams.doctorId;

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [symptomsReason, setSymptomsReason] = useState<string>('');

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) return;
    router.push('/appointment-success');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Book an Appointment
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Select a doctor, choose a date and time, and confirm your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* 👈 تمرير selectedDoctorId و autoSelectId إلى DoctorSelector */}
            <DoctorSelector
              selectedDoctorId={selectedDoctor?.id || routeDoctorId}
              autoSelectId={routeDoctorId}
              onSelect={setSelectedDoctor}
            />

            <DatePicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <TimeSlotSelector
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />

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

          <div className="lg:col-span-1">
            {selectedDoctor ? (
              <BookingSummary
                doctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                patientName="Ali Hassan"
                onConfirm={handleConfirm}
              />
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center text-gray-400 text-sm shadow-sm">
                Please select a doctor to view summary.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}