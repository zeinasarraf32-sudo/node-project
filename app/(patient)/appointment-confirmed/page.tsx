'use client';

import {
  useState,
  useSyncExternalStore,
} from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import Link from 'next/link';

import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  X,
  Loader2,
  User,
} from 'lucide-react';

import {
  axiosGet,
  axiosDelete,
} from '@/lib/axios';

import {
  Appointment,
} from '@/interfaces/interfaces';

const emptySubscribe = () => () => {};

export default function AppointmentsPage() {
  const queryClient = useQueryClient();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeTab, setActiveTab] = useState<
    'upcoming' | 'previous'
  >('upcoming');

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  /*
   * Read patient ID only after hydration.
   */
  const patientId = isClient
    ? localStorage.getItem('patientId') ||
      localStorage.getItem('userId') ||
      ''
    : '';

  /*
   * GET Appointments
   */
  const {
    data: appointmentsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['patient-appointments', patientId],

    queryFn: () =>
      axiosGet<Appointment[]>(
        `appointments?patientId=${encodeURIComponent(patientId)}`
      ),

    enabled: isClient && Boolean(patientId),
  });

  /*
   * DELETE Appointment
   */
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axiosDelete<Appointment>(
        `appointments/${id}`
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'patient-appointments',
          patientId,
        ],
      });

      setSelectedAppointment(null);
    },
  });

  const appointments: Appointment[] =
    appointmentsData?.data ?? [];

  const upcomingAppointments =
    appointments.filter(
      (apt) =>
        apt.status === 'CONFIRMED' ||
        apt.status === 'PENDING'
    );

  const completedAppointments =
    appointments.filter(
      (apt) =>
        apt.status === 'COMPLETED'
    );

  const cancelledAppointments =
    appointments.filter(
      (apt) =>
        apt.status === 'CANCELLED'
    );

  const displayedAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : [
          ...completedAppointments,
          ...cancelledAppointments,
        ];

  /*
   * Hydration Loading State
   */
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />

          <p className="text-sm font-medium">
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              My Appointments
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage all your medical appointments
            </p>
          </div>

          <Link
            href="/doctors"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Book New
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-blue-600">
              {upcomingAppointments.length}
            </span>

            <p className="text-xs font-semibold text-gray-500 mt-1">
              Upcoming
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-emerald-600">
              {completedAppointments.length}
            </span>

            <p className="text-xs font-semibold text-gray-500 mt-1">
              Completed
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-3xl font-bold text-rose-500">
              {cancelledAppointments.length}
            </span>

            <p className="text-xs font-semibold text-gray-500 mt-1">
              Cancelled
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('previous')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'previous'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Previous (
            {completedAppointments.length +
              cancelledAppointments.length}
            )
          </button>
        </div>

        {/* No Patient ID */}
        {!patientId ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              Please log in to view your appointments.
            </p>

            <Link
              href="/login"
              className="inline-block mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Login
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-red-500 font-medium">
              Failed to load appointments.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : displayedAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-medium">
              No appointments found in this section.
            </p>

            <Link
              href="/doctors"
              className="inline-block mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((apt) => {
              const formattedDate = new Date(
                apt.date
              ).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const doctorImage =
                apt.doctor?.imageUrl?.trim();

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">

                    {/* Doctor Image */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {doctorImage ? (
                        <img
                          src={doctorImage}
                          alt={apt.doctor.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-gray-400" />
                      )}
                    </div>

                    {/* Doctor Information */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">
                          {apt.doctor.fullName}
                        </h3>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            apt.status === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-600'
                              : apt.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600'
                              : apt.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-blue-600 font-medium">
                        {apt.doctor.specialty}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {apt.time}
                        </span>

                        {apt.doctor.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {apt.doctor.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAppointment(apt)
                      }
                      className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-xl transition"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMutation.mutate(apt.id)
                      }
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition disabled:opacity-50"
                      title="Delete Appointment"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Appointment Details
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Appointment #{selectedAppointment.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAppointment(null)
                  }
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Doctor */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                  {selectedAppointment.doctor.imageUrl?.trim() ? (
                    <img
                      src={
                        selectedAppointment.doctor.imageUrl
                      }
                      alt={
                        selectedAppointment.doctor.fullName
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    {selectedAppointment.doctor.fullName}
                  </p>

                  <p className="text-xs text-blue-600 font-medium">
                    {selectedAppointment.doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mt-5">
                <div>
                  <p className="text-xs text-gray-400">
                    Appointment ID
                  </p>

                  <p className="font-semibold text-gray-900">
                    #{selectedAppointment.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Date
                  </p>

                  <p className="font-semibold text-gray-900">
                    {new Date(
                      selectedAppointment.date
                    ).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Time
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedAppointment.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedAppointment.doctor.location ||
                      'Not specified'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Reason
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedAppointment.reason ||
                      'No reason provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full ${
                      selectedAppointment.status === 'CONFIRMED'
                        ? 'bg-blue-50 text-blue-600'
                        : selectedAppointment.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-600'
                        : selectedAppointment.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}