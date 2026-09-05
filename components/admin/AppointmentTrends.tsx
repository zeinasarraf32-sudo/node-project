'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosGet } from '@/lib/axios';

type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface Appointment {
  id: number;
  date: string;
  status: AppointmentStatus;
}

interface MonthlyStat {
  key: string;
  month: string;
  appointments: number;
  completed: number;
}

export default function AppointmentTrends() {
  const [activeStat, setActiveStat] = useState<MonthlyStat | null>(null);

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axiosGet<Appointment[]>('appointments');
      return response.data || [];
    },
  });

  const trendData = useMemo(() => {
    const now = new Date();

    const months: MonthlyStat[] = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        appointments: 0,
        completed: 0,
      };
    });

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      const month = months.find((item) => item.key === key);
      if (!month) return;

      month.appointments += 1;

      if (appointment.status === 'COMPLETED') {
        month.completed += 1;
      }
    });

    return months;
  }, [appointments]);

  const maxValue = Math.max(
    1,
    ...trendData.map((item) => Math.max(item.appointments, item.completed))
  );

  const getPoints = (field: 'appointments' | 'completed') => {
    return trendData
      .map((item, index) => {
        const x = (index / (trendData.length - 1)) * 500;
        const y = 95 - (item[field] / maxValue) * 80;

        return `${x},${y}`;
      })
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-72 flex items-center justify-center text-xs text-slate-400">
        Loading appointment trends...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-72 flex items-center justify-center text-xs text-rose-500">
        Failed to load appointment trends.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-sm">
          Appointment Trends
        </h3>

        <span className="text-xs text-slate-400 font-medium">
          Last 6 months
        </span>
      </div>

      <div className="h-8 mb-2 flex items-center">
        {activeStat ? (
          <div className="w-full text-xs flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700">
              {activeStat.month}:
            </span>

            <div className="flex gap-4">
              <span className="text-blue-600 font-semibold">
                Total: {activeStat.appointments}
              </span>

              <span className="text-emerald-600 font-semibold">
                Completed: {activeStat.completed}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">
            Hover over the chart to see details
          </span>
        )}
      </div>

      <div className="h-44 w-full border-b border-slate-100 relative">
        <div className="absolute inset-x-8 top-4 bottom-4">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={getPoints('appointments')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            <polyline
              points={getPoints('completed')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />

            {trendData.map((item, index) => {
              const x = (index / (trendData.length - 1)) * 500;

              return (
                <rect
                  key={item.key}
                  x={x - 35}
                  y="0"
                  width="70"
                  height="100"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveStat(item)}
                  onMouseLeave={() => setActiveStat(null)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-6">
        {trendData.map((item) => (
          <span
            key={item.key}
            className={
              activeStat?.key === item.key
                ? 'text-blue-600 font-bold'
                : ''
            }
          >
            {item.month}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Total Appointments
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Completed
        </div>
      </div>
    </div>
  );
}