'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  // استخدام تاريخ حقيقي في الـ State للتحكم بالشهر والسنة
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // الحصول على عدد الأيام في الشهر الحالي
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  // معرفة بداية الشهر في أي يوم أسبوع يقع (0 = الأحد, 6 = السبت) لحساب الـ Offset ديناميكياً
  const firstDayIndex = new Date(year, month, 1).getDay();

  // أسماء الشهور
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // دوال التنقل بين الشهور
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDaySelect = (day: number) => {
    // ضبط الوقت عند 12:00 ظهراً لمنع تداخل المناطق الزمنية (Timezone Shift)
    const fullDate = new Date(year, month, day, 12, 0, 0);
    onSelectDate(fullDate);
  };

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
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="font-semibold text-gray-900">{monthName}</span>
          
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-medium text-gray-700">
          {/* حساب الإزاحة فارغة حسب أول يوم في الشهر ديناميكياً */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`offset-${i}`} />
          ))}

          {daysInMonth.map((day) => {
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDaySelect(day)}
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