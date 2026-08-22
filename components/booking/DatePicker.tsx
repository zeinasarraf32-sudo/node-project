'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: number | null;
  onSelectDate: (day: number) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const [currentMonth] = useState('August 2026');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          2
        </span>
        <h2 className="text-lg font-bold text-gray-900">Choose a Date</h2>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between px-4 mb-6">
          <button type="button" className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900">{currentMonth}</span>
          <button type="button" className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-medium text-gray-700">
          {/* August 1 starts on Saturday (6 empty offset blocks) */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`offset-${i}`} />
          ))}

          {daysInMonth.map((day) => {
            const isSelected = selectedDate === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDate(day)}
                className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center transition text-sm ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}