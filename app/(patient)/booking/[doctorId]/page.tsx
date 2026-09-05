'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';

import DoctorSelector from '@/components/booking/DoctorSelector';
import DatePicker from '@/components/booking/DatePicker';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import BookingSummary from '@/components/booking/BookingSummary';

import { axiosGet, axiosPost } from '@/lib/axios';

import {
  Appointment,
  CreateAppointmentBody,
  IBackendDoctor,
  IBookingDoctor,
} from '@/interfaces/interfaces';

export default function BookingPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  const routeDoctorId = String(
    resolvedParams.doctorId
  );

  const [overrideDoctor, setOverrideDoctor] =
    useState<IBookingDoctor | null>(null);

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [selectedTime, setSelectedTime] =
    useState<string | null>(null);

  const [symptomsReason, setSymptomsReason] =
    useState('');

  const [error, setError] = useState('');

  /*
   * GET Doctors
   */
  const {
    data: doctorsResponse,
    isLoading: isDoctorsLoading,
    isError: isDoctorsError,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: () =>
      axiosGet<IBackendDoctor[]>('doctors'),
  });

  const doctorsData =
    doctorsResponse?.data || [];

  /*
   * Find ACTIVE doctor from route.
   */
  const foundDoctor = doctorsData.find(
    (doctor) =>
      String(doctor.id) === routeDoctorId &&
      doctor.status === 'ACTIVE'
  );

  const fetchedDoctor: IBookingDoctor | null =
    foundDoctor
      ? {
          id: String(foundDoctor.id),

          name:
            foundDoctor.fullName ||
            foundDoctor.name ||
            'Doctor',

          specialty:
            foundDoctor.specialty ||
            'Not specified',

          fee: Number(
            foundDoctor.consultationFee ??
            foundDoctor.fee ??
            foundDoctor.price ??
            0
          ),

          avatar:
            foundDoctor.imageUrl ||
            foundDoctor.image ||
            '',

          location:
            foundDoctor.location ||
            'Not provided',
        }
      : null;

  const selectedDoctor =
    overrideDoctor || fetchedDoctor;

  /*
   * Patient Data
   */
  const [patientData] = useState<{
    id: string;
    name: string;
  }>(() => {
    if (typeof window === 'undefined') {
      return {
        id: '',
        name: 'Guest Patient',
      };
    }

    const storedId =
      localStorage.getItem('patientId') ||
      localStorage.getItem('userId') ||
      '';

    const storedName =
      localStorage.getItem('userName') ||
      'Patient';

    return {
      id: storedId,
      name: storedName,
    };
  });

  /*
   * Doctor Availability
   */
  const selectedDateIso =
    selectedDate
      ? selectedDate.toISOString()
      : '';

  const availabilityDoctorId =
    selectedDoctor?.id || '';

  const {
    data: availabilityResponse,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
  } = useQuery({
    queryKey: [
      'doctor-availability',
      availabilityDoctorId,
      selectedDateIso,
    ],

    queryFn: () =>
      axiosGet<Appointment[]>(
        `appointments?doctorId=${encodeURIComponent(
          availabilityDoctorId
        )}&date=${encodeURIComponent(
          selectedDateIso
        )}`
      ),

    enabled: Boolean(
      availabilityDoctorId &&
      selectedDateIso
    ),
  });

  const bookedTimes =
    availabilityResponse?.data?.map(
      (appointment) => appointment.time
    ) || [];

  /*
   * Create Appointment
   */
  const bookingMutation = useMutation({
    mutationFn: (
      newBooking: CreateAppointmentBody
    ) =>
      axiosPost<
        CreateAppointmentBody,
        Appointment
      >('appointments', newBooking),

    onSuccess: (response) => {
      setError('');

      if (response.data?.id) {
        sessionStorage.setItem(
          'lastAppointmentId',
          String(response.data.id)
        );
      }

      router.push('/appointment-success');
    },

    onError: (bookingError) => {
      console.error(
        'Failed to book appointment:',
        bookingError
      );

      setSelectedTime(null);
      void refetchAvailability();

      setError(
        bookingError instanceof Error
          ? bookingError.message
          : 'Failed to confirm booking. Please try again.'
      );
    },
  });

  /*
   * Confirm Booking
   */
  const handleConfirm = () => {
    setError('');

    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }

    if (!selectedDate) {
      setError('Please select an appointment date.');
      return;
    }

    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      setError(
        'Appointments cannot be booked in the past.'
      );
      return;
    }

    if (!selectedTime) {
      setError('Please select a time slot.');
      return;
    }

    if (isAvailabilityLoading) {
      setError(
        'Please wait while we check time slot availability.'
      );
      return;
    }

    if (isAvailabilityError) {
      setError(
        'Could not check time slot availability. Please try again.'
      );
      return;
    }

    if (bookedTimes.includes(selectedTime)) {
      setSelectedTime(null);

      setError(
        'This time slot is already booked. Please choose another time.'
      );
      return;
    }

    if (!patientData.id) {
      setError(
        'Patient information is missing. Please log in again.'
      );
      return;
    }

    const numericPatientId =
      Number(patientData.id);

    const numericDoctorId =
      Number(selectedDoctor.id);

    if (
      !Number.isInteger(numericPatientId) ||
      numericPatientId <= 0
    ) {
      setError(
        'Invalid patient information. Please log in again.'
      );
      return;
    }

    if (
      !Number.isInteger(numericDoctorId) ||
      numericDoctorId <= 0
    ) {
      setError('Invalid doctor information.');
      return;
    }

    bookingMutation.mutate({
      doctorId: numericDoctorId,
      patientId: numericPatientId,
      date: selectedDate.toISOString(),
      time: selectedTime,
      reason: symptomsReason.trim(),
    });
  };

  /*
   * Loading State
   */
  if (isDoctorsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />

        <p className="text-sm font-medium">
          Loading doctor details...
        </p>
      </div>
    );
  }

  /*
   * Error State
   */
  if (isDoctorsError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">
          Failed to load doctors.
        </p>

        <button
          type="button"
          onClick={() => router.push('/doctors')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  /*
   * Doctor Not Found / Not Active
   */
  if (!selectedDoctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 font-medium">
          Doctor is not available for booking.
        </p>

        <button
          type="button"
          onClick={() => router.push('/doctors')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Book an Appointment
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Select a doctor, choose a date and time,
          and confirm your appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-8">
          <DoctorSelector
            selectedDoctorId={selectedDoctor.id}
            onSelectDoctor={(doctor) => {
              setOverrideDoctor(doctor);
              setSelectedTime(null);
              setError('');
            }}
          />

          <DatePicker
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
              setError('');
            }}
          />

          <TimeSlotSelector
            selectedTime={selectedTime}
            bookedTimes={bookedTimes}
            isLoading={isAvailabilityLoading}
            isError={isAvailabilityError}
            disabled={!selectedDate}
            onSelectTime={(time) => {
              setSelectedTime(time);
              setError('');
            }}
          />

          {/* Reason */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-base">
              Reason for Visit
            </h3>

            <textarea
              value={symptomsReason}
              onChange={(event) =>
                setSymptomsReason(event.target.value)
              }
              placeholder="Describe your symptoms or reason for appointment (optional)..."
              className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-1 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          <BookingSummary
            doctor={selectedDoctor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            patientName={patientData.name}
            onConfirm={handleConfirm}
            isSubmitting={bookingMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}