'use client';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export default function TimeSlotSelector({ selectedTime, onSelectTime }: TimeSlotSelectorProps) {
  const slots: TimeSlot[] = [
    { time: '8:00 AM', available: true },
    { time: '9:00 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '2:00 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '5:00 PM', available: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          3
        </span>
        <h2 className="text-lg font-bold text-gray-900">Select Time Slot</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;

          if (!slot.available) {
            return (
              <div
                key={slot.time}
                className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-100 text-center text-sm font-medium text-gray-300 line-through cursor-not-allowed"
              >
                {slot.time}
              </div>
            );
          }

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => onSelectTime(slot.time)}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                  : 'bg-blue-50/50 text-blue-600 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 pt-1 font-medium">
        Strikethrough times are already booked.
      </p>
    </div>
  );
}