'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosGet } from '@/lib/axios';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: {
    id: number;
    fullName: string;
  };
}

interface WorkloadData {
  id: number;
  name: string;
  morningAppointments: number;
  eveningAppointments: number;
}

function isMorning(time: string) {
  const value = time.trim().toUpperCase();

  if (value.includes('AM')) {
    return true;
  }

  if (value.includes('PM')) {
    return false;
  }

  const hour = Number(value.split(':')[0]);

  return !Number.isNaN(hour) && hour < 12;
}

export default function DoctorWorkload() {
  const [hoveredDoc, setHoveredDoc] = useState<WorkloadData | null>(null);

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axiosGet<Appointment[]>('appointments');
      return response.data || [];
    },
  });

  const workloadList = useMemo(() => {
    const today = new Date();
    const doctorMap = new Map<number, WorkloadData>();

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);

      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

      if (!isToday) return;

      const existing = doctorMap.get(appointment.doctor.id) || {
        id: appointment.doctor.id,
        name: appointment.doctor.fullName,
        morningAppointments: 0,
        eveningAppointments: 0,
      };

      if (isMorning(appointment.time)) {
        existing.morningAppointments += 1;
      } else {
        existing.eveningAppointments += 1;
      }

      doctorMap.set(appointment.doctor.id, existing);
    });

    return Array.from(doctorMap.values()).sort(
      (a, b) =>
        b.morningAppointments +
        b.eveningAppointments -
        (a.morningAppointments + a.eveningAppointments)
    );
  }, [appointments]);

  const maxAppointments = Math.max(
    1,
    ...workloadList.flatMap((doctor) => [
      doctor.morningAppointments,
      doctor.eveningAppointments,
    ])
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-xs text-slate-400">
        Loading doctor workload...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-xs text-rose-500">
        Failed to load doctor workload.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
      <div className="flex items-center justify-between mb-4 h-7">
        <h3 className="font-semibold text-slate-800 text-sm">
          Doctor Workload (Today)
        </h3>

        {hoveredDoc ? (
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full">
            Dr. {hoveredDoc.name}:{' '}
            {hoveredDoc.morningAppointments +
              hoveredDoc.eveningAppointments}{' '}
            Total
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {workloadList.length > 0
              ? 'Hover over bars'
              : 'No appointments today'}
          </span>
        )}
      </div>

      {workloadList.length === 0 ? (
        <div className="h-44 flex items-center justify-center border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-400">
            No doctor appointments scheduled for today.
          </p>
        </div>
      ) : (
        <>
          <div className="h-44 flex items-end justify-around gap-4 border-b border-slate-100 pb-2 pt-6">
            {workloadList.map((doctor) => {
              const morningHeight =
                (doctor.morningAppointments / maxAppointments) * 120;

              const eveningHeight =
                (doctor.eveningAppointments / maxAppointments) * 120;

              return (
                <div
                  key={doctor.id}
                  onMouseEnter={() => setHoveredDoc(doctor)}
                  onMouseLeave={() => setHoveredDoc(null)}
                  className="flex flex-col items-center group cursor-pointer relative"
                >
                  {hoveredDoc?.id === doctor.id && (
                    <div className="absolute -top-14 bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded-lg whitespace-nowrap shadow-md z-10">
                      <div>AM: {doctor.morningAppointments}</div>
                      <div>PM: {doctor.eveningAppointments}</div>
                    </div>
                  )}

                  <div className="flex gap-1 items-end h-32">
                    <div
                      className="w-3.5 bg-blue-200 rounded-t transition-all group-hover:bg-blue-300"
                      style={{
                        height: `${Math.max(
                          doctor.morningAppointments ? 8 : 0,
                          morningHeight
                        )}px`,
                      }}
                    />

                    <div
                      className="w-3.5 bg-blue-600 rounded-t transition-all group-hover:bg-blue-700"
                      style={{
                        height: `${Math.max(
                          doctor.eveningAppointments ? 8 : 0,
                          eveningHeight
                        )}px`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-around text-[10px] text-slate-400 mt-3">
            {workloadList.map((doctor) => (
              <span
                key={doctor.id}
                className={`truncate max-w-20 text-center ${
                  hoveredDoc?.id === doctor.id
                    ? 'text-blue-600 font-bold'
                    : ''
                }`}
              >
                {doctor.name}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-5 mt-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-200" />
              Morning
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Evening
            </span>
          </div>
        </>
      )}
    </div>
  );
}