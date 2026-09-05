'use client';

import {
  useSyncExternalStore,
} from 'react';

import Link from 'next/link';

import {
  Calendar,
  Check,
  Clock,
  MapPin,
  User,
} from 'lucide-react';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  axiosGet,
} from '@/lib/axios';

import {
  Appointment,
} from '@/interfaces/interfaces';

import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

const emptySubscribe = () => () => {};

export default function AppointmentSuccessPage() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  /*
   * Read browser storage only
   * after hydration.
   */
  const patientId = isClient
    ? localStorage.getItem('patientId') ||
      localStorage.getItem('userId') ||
      ''
    : '';

  const appointmentId = isClient
    ? sessionStorage.getItem('lastAppointmentId') ||
      ''
    : '';

  /*
   * GET real appointments
   * from database.
   */
  const {
    data: appointmentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'appointment-success',
      patientId,
    ],

    queryFn: () =>
      axiosGet<Appointment[]>(
        `appointments?patientId=${encodeURIComponent(patientId)}`
      ),

    enabled:
      isClient &&
      Boolean(patientId),
  });

  const appointments =
    appointmentsResponse?.data ?? [];

  /*
   * Find newly created appointment
   * using real database ID.
   */
  const appointment =
    appointments.find(
      (item) =>
        String(item.id) ===
        appointmentId
    );

  /*
   * Hydration Loading State
   */
  if (!isClient) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <LoadingState message="Loading appointment..." />
      </div>
    );
  }

  /*
   * Missing Patient State
   */
  if (!patientId) {
    return (
      <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-sm border border-gray-100 text-center">
          <h1 className="text-xl font-bold text-gray-900">
            Patient information not found
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Please log in again to continue.
          </p>

          <Link
            href="/login"
            className="inline-flex mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <LoadingState message="Loading appointment details..." />
      </div>
    );
  }

  /*
   * Error State
   */
  if (isError) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <ErrorState
            message="Failed to load your appointment."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  /*
   * Appointment Not Found State
   */
  if (!appointmentId || !appointment) {
    return (
      <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Appointment Not Found
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              We could not find the appointment details.
            </p>
          </div>

          <Link
            href="/appointment-confirmed"
            className="inline-flex px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            View My Appointments
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate =
    new Date(
      appointment.date
    ).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const doctorImage =
    appointment.doctor.imageUrl?.trim();

  /*
   * Success State
   */
  return (
    <div className="min-h-[85vh] bg-slate-50/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-sm border border-gray-100 text-center space-y-6">

        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
        </div>

        {/* Success Message */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Confirmed!
          </h1>

          <p className="text-sm text-gray-500">
            Your appointment has been successfully booked.
          </p>

          <p className="text-xs text-gray-400 pt-1">
            Appointment #{appointment.id}
          </p>
        </div>

        {/* Real Appointment Details */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 text-left space-y-4">

          {/* Doctor */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
              {doctorImage ? (
                <img
                  src={doctorImage}
                  alt={appointment.doctor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                {appointment.doctor.fullName}
              </h3>

              <p className="text-xs text-blue-600 font-medium">
                {appointment.doctor.specialty}
              </p>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="space-y-3 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />

              <span>
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />

              <span>
                {appointment.time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />

              <span>
                {appointment.doctor.location ||
                  'Location not specified'}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-400">
                Reason:
              </span>{' '}

              <span className="text-gray-700">
                {appointment.reason ||
                  'No reason provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/appointment-confirmed"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-sm flex items-center justify-center"
          >
            View My Appointments
          </Link>

          <Link
            href="/doctors"
            className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition flex items-center justify-center"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}