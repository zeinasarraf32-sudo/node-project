'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function DatePicker({
  selectedDate,
  onSelectDate,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const daysOfWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonthStart = new Date(
    year,
    month,
    1
  );

  const todayMonthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const canGoToPreviousMonth =
    currentMonthStart > todayMonthStart;

  const daysInMonthCount = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const daysInMonth = Array.from(
    { length: daysInMonthCount },
    (_, index) => index + 1
  );

  const firstDayIndex = new Date(
    year,
    month,
    1
  ).getDay();

  const monthName =
    currentDate.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    );

  const handlePrevMonth = () => {
    if (!canGoToPreviousMonth) {
      return;
    }

    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const handleDaySelect = (
    day: number
  ) => {
    const dateOnly = new Date(
      year,
      month,
      day
    );

    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly < today) {
      return;
    }

    /*
     * Keep noon to avoid timezone shifts
     * when converting the selected date to ISO.
     */
    const fullDate = new Date(
      year,
      month,
      day,
      12,
      0,
      0
    );

    onSelectDate(fullDate);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          2
        </span>

        <h2 className="text-lg font-bold text-gray-900">
          Choose a Date
        </h2>
      </div>

      <div className="pt-2">

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 mb-6">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={
              !canGoToPreviousMonth
            }
            className={`p-1 rounded-lg transition ${
              canGoToPreviousMonth
                ? 'text-gray-500 hover:bg-gray-100'
                : 'text-gray-200 cursor-not-allowed'
            }`}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-semibold text-gray-900">
            {monthName}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day}>
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-medium text-gray-700">
          {Array.from({
            length: firstDayIndex,
          }).map((_, index) => (
            <div
              key={`offset-${index}`}
            />
          ))}

          {daysInMonth.map((day) => {
            const dateOnly = new Date(
              year,
              month,
              day
            );

            dateOnly.setHours(
              0,
              0,
              0,
              0
            );

            const isPastDate =
              dateOnly < today;

            const isSelected =
              selectedDate !== null &&
              selectedDate.getDate() ===
                day &&
              selectedDate.getMonth() ===
                month &&
              selectedDate.getFullYear() ===
                year;

            return (
              <button
                key={day}
                type="button"
                disabled={isPastDate}
                onClick={() =>
                  handleDaySelect(day)
                }
                className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center transition text-sm ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : isPastDate
                      ? 'text-gray-300 cursor-not-allowed'
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