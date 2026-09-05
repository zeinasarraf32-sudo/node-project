'use client';

import React, { useState } from 'react';
import {
  MoreVertical,
  CalendarDays,
  Check,
  Loader2,
} from 'lucide-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  axiosGet,
  axiosPut,
} from '@/lib/axios';

import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface AdminAppointment {
  id: number;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;

  patient: {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    imageUrl: string | null;
  };

  doctor: {
    id: number;
    fullName: string;
    specialty: string;
    imageUrl: string | null;
    location: string | null;
  };
}

interface UpdateAppointmentBody {
  status: AppointmentStatus;
}

const filterTabs = [
  'All',
  'Confirmed',
  'Pending',
  'Completed',
  'Cancelled',
] as const;

const statusOptions: AppointmentStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
];

export default function AppointmentsTable() {
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] =
    useState<(typeof filterTabs)[number]>('All');

  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  const [updateError, setUpdateError] =
    useState('');

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response =
        await axiosGet<AdminAppointment[]>(
          'appointments'
        );

      return response.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: number;
      status: AppointmentStatus;
    }) => {
      return axiosPut<
        UpdateAppointmentBody,
        AdminAppointment
      >(
        `appointments/${appointmentId}`,
        {
          status,
        }
      );
    },

    onSuccess: async () => {
      setUpdateError('');
      setOpenMenuId(null);

      await queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
    },

    onError: (error) => {
      console.error(
        'Failed to update appointment status:',
        error
      );

      setUpdateError(
        error instanceof Error
          ? error.message
          : 'Failed to update appointment status'
      );
    },
  });

  const handleStatusChange = (
    appointmentId: number,
    status: AppointmentStatus
  ) => {
    setUpdateError('');

    updateStatusMutation.mutate({
      appointmentId,
      status,
    });
  };

  const filteredAppointments =
    appointments.filter((appointment) => {
      if (activeFilter === 'All') {
        return true;
      }

      return (
        appointment.status ===
        activeFilter.toUpperCase()
      );
    });

  const getStatusBadgeClass = (
    status: AppointmentStatus
  ) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-600 border-blue-100';

      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';

      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-100';

      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-100';

      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusMenuClass = (
    status: AppointmentStatus
  ) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-blue-600';

      case 'COMPLETED':
        return 'text-emerald-600';

      case 'PENDING':
        return 'text-amber-600';

      case 'CANCELLED':
        return 'text-rose-600';

      default:
        return 'text-slate-600';
    }
  };

  const formatStatus = (
    status: AppointmentStatus
  ) => {
    return (
      status.charAt(0) +
      status.slice(1).toLowerCase()
    );
  };

  const formatDateTime = (
    date: string,
    time: string
  ) => {
    const formattedDate =
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(date));

    return `${formattedDate}, ${time}`;
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Failed to load appointments'
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible">

      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Appointments
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            {appointments.length} appointments in database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-50/80 p-1 rounded-xl text-xs font-medium text-slate-600 border border-slate-100">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setActiveFilter(filter)
              }
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Update Error */}
      {updateError && (
        <div className="mx-5 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-medium text-red-600">
          {updateError}
        </div>
      )}

      {filteredAppointments.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
            <CalendarDays className="w-5 h-5 text-slate-400" />
          </div>

          <p className="text-sm font-semibold text-slate-700">
            No appointments found
          </p>

          <p className="text-xs text-slate-400 mt-1">
            There are no appointments matching this filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider">
                <th className="py-4 px-6">
                  Patient
                </th>

                <th className="py-4 px-6">
                  Doctor
                </th>

                <th className="py-4 px-6">
                  Date & Time
                </th>

                <th className="py-4 px-6">
                  Status
                </th>

                <th className="py-4 px-6 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredAppointments.map(
                (appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Patient */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100">
                          {appointment.patient.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <span className="block font-semibold text-slate-800">
                            {appointment.patient.fullName}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {appointment.patient.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-700">
                        Dr. {appointment.doctor.fullName}
                      </span>

                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {appointment.doctor.specialty}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-600">
                      {formatDateTime(
                        appointment.date,
                        appointment.time
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {formatStatus(
                          appointment.status
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId ===
                                appointment.id
                                ? null
                                : appointment.id
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId ===
                          appointment.id && (
                          <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-left">
                            <div className="px-3 py-2 border-b border-slate-100">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Change Status
                              </p>
                            </div>

                            <div className="p-1">
                              {statusOptions.map(
                                (status) => {
                                  const isCurrent =
                                    appointment.status ===
                                    status;

                                  const isUpdating =
                                    updateStatusMutation.isPending &&
                                    updateStatusMutation.variables
                                      ?.appointmentId ===
                                      appointment.id &&
                                    updateStatusMutation.variables
                                      ?.status ===
                                      status;

                                  return (
                                    <button
                                      key={status}
                                      type="button"
                                      disabled={
                                        isCurrent ||
                                        updateStatusMutation.isPending
                                      }
                                      onClick={() =>
                                        handleStatusChange(
                                          appointment.id,
                                          status
                                        )
                                      }
                                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 disabled:cursor-default transition-colors cursor-pointer"
                                    >
                                      <span
                                        className={`text-xs font-semibold ${getStatusMenuClass(
                                          status
                                        )}`}
                                      >
                                        {formatStatus(
                                          status
                                        )}
                                      </span>

                                      {isUpdating ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                                      ) : (
                                        isCurrent && (
                                          <Check className="w-3.5 h-3.5 text-slate-500" />
                                        )
                                      )}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}