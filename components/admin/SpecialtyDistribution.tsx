'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosGet } from '@/lib/axios';
import { IDoctor } from '@/interfaces/interfaces';

interface SpecialtyItem {
  id: string;
  name: string;
  doctors: number;
  percentage: number;
  bg: string;
  color: string;
}

const colors = [
  { bg: 'bg-blue-600', color: '#2563eb' },
  { bg: 'bg-emerald-500', color: '#10b981' },
  { bg: 'bg-indigo-600', color: '#4f46e5' },
  { bg: 'bg-amber-500', color: '#f59e0b' },
];

export default function SpecialtyDistribution() {
  const [active, setActive] = useState<SpecialtyItem | null>(null);
  const [selected, setSelected] = useState<SpecialtyItem | null>(null);

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['admin-doctors-stats'],
    queryFn: async () => {
      const response = await axiosGet<IDoctor[]>('doctors');
      return response.data || [];
    },
  });

  const specialties = useMemo(() => {
    const counts = new Map<string, number>();

    doctors.forEach((doctor) => {
      const specialty = doctor.specialty?.trim() || 'Other';

      counts.set(
        specialty,
        (counts.get(specialty) || 0) + 1
      );
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count], index) => ({
        id: `${name}-${index}`,
        name,
        doctors: count,
        percentage: doctors.length
          ? Math.round((count / doctors.length) * 100)
          : 0,
        bg: colors[index].bg,
        color: colors[index].color,
      }));
  }, [doctors]);

  const gradient = useMemo(() => {
    if (specialties.length === 0) {
      return '#e2e8f0';
    }

    let current = 0;

    const parts = specialties.map((item) => {
      const start = current;
      const end = current + item.percentage;

      current = end;

      return `${item.color} ${start}% ${end}%`;
    });

    if (current < 100) {
      parts.push(`#e2e8f0 ${current}% 100%`);
    }

    return `conic-gradient(${parts.join(', ')})`;
  }, [specialties]);

  const getSpecialtyFromPointer = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (specialties.length === 0) {
      return null;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);

    if (distance < 40 || distance > 64) {
      return null;
    }

    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;

    if (angle < 0) {
      angle += 360;
    }

    const percentagePosition = (angle / 360) * 100;

    let current = 0;

    for (const specialty of specialties) {
      const end = current + specialty.percentage;

      if (
        percentagePosition >= current &&
        percentagePosition < end
      ) {
        return specialty;
      }

      current = end;
    }

    return null;
  };

  const handleCircleHover = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const specialty = getSpecialtyFromPointer(event);

    if (specialty) {
      setActive(specialty);
    }
  };

  const handleCircleClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const specialty = getSpecialtyFromPointer(event);

    if (specialty) {
      setSelected(specialty);
      setActive(specialty);
    }
  };

  const handleCircleLeave = () => {
    setActive(selected);
  };

  const handleListHover = (item: SpecialtyItem) => {
    setActive(item);
  };

  const handleListLeave = () => {
    setActive(selected);
  };

  const handleListClick = (item: SpecialtyItem) => {
    setSelected(item);
    setActive(item);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex items-center justify-center text-xs text-slate-400">
        Loading specialties...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex items-center justify-center text-xs text-rose-500">
        Failed to load specialties.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-semibold text-slate-800 text-sm">
        By Specialty
      </h3>

      {specialties.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          No doctors available.
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center my-3">
            <div
              onMouseMove={handleCircleHover}
              onMouseLeave={handleCircleLeave}
              onClick={handleCircleClick}
              className="w-32 h-32 rounded-full flex items-center justify-center p-3 shadow-inner cursor-pointer"
              style={{ background: gradient }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-sm pointer-events-none">
                {active ? (
                  <>
                    <p className="text-xs font-bold text-slate-800">
                      {active.percentage}%
                    </p>

                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[65px]">
                      {active.name}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-800">
                      {doctors.length}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Doctors
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {specialties.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => handleListHover(item)}
                onMouseLeave={handleListLeave}
                onClick={() => handleListClick(item)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg cursor-pointer ${
                  active?.id === item.id
                    ? 'bg-slate-50'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${item.bg}`}
                  />

                  <span className="text-slate-700 truncate max-w-32">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400">
                    {item.doctors} doctor
                    {item.doctors !== 1 ? 's' : ''}
                  </span>

                  <span className="font-bold text-slate-800">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}