'use client';

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

type AppointmentStatus = 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar: string;
  doctorName: string;
  dateTime: string;
  status: AppointmentStatus;
}

const initialAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Ali Hassan',
    patientAvatar: 'A',
    doctorName: 'Dr. Al-Halabi',
    dateTime: 'Aug 4, 10:00 AM',
    status: 'Confirmed',
  },
  {
    id: '2',
    patientName: 'Rana Saad',
    patientAvatar: 'R',
    doctorName: 'Dr. Issa',
    dateTime: 'Aug 4, 11:30 AM',
    status: 'Completed',
  },
  {
    id: '3',
    patientName: 'Khalid Najm',
    patientAvatar: 'K',
    doctorName: "Dr. Al-Rafi'i",
    dateTime: 'Aug 4, 2:00 PM',
    status: 'Pending',
  },
  {
    id: '4',
    patientName: 'Nour Al-Din',
    patientAvatar: 'N',
    doctorName: 'Dr. Karami',
    dateTime: 'Aug 4, 3:30 PM',
    status: 'Confirmed',
  },
  {
    id: '5',
    patientName: 'Maisa Taha',
    patientAvatar: 'M',
    doctorName: 'Dr. Salama',
    dateTime: 'Aug 4, 4:00 PM',
    status: 'Cancelled',
  },
];

const filterTabs = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as const;

export default function AppointmentsTable() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredAppointments = initialAppointments.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Header & Filter Tabs */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
        <h3 className="text-base font-bold text-slate-800">appointments</h3>

        <div className="flex flex-wrap items-center gap-1 bg-slate-50/80 p-1 rounded-xl text-xs font-medium text-slate-600 border border-slate-100">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
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

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider">
              <th className="py-4 px-6">Patient</th>
              <th className="py-4 px-6">Doctor</th>
              <th className="py-4 px-6">Date & Time</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filteredAppointments.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                {/* Patient Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200">
                      {item.patientAvatar}
                    </div>
                    <span className="font-semibold text-slate-800">{item.patientName}</span>
                  </div>
                </td>

                {/* Doctor Name */}
                <td className="py-4 px-6 text-slate-600 font-medium">{item.doctorName}</td>

                {/* Date & Time */}
                <td className="py-4 px-6 text-slate-600">{item.dateTime}</td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}