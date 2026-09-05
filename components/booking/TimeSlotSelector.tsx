'use client';

interface TimeSlotSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  bookedTimes?: string[];
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
}

const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export default function TimeSlotSelector({
  selectedTime,
  onSelectTime,
  bookedTimes = [],
  isLoading = false,
  isError = false,
  disabled = false,
}: TimeSlotSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          3
        </span>

        <h2 className="text-lg font-bold text-gray-900">
          Select Time Slot
        </h2>
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {TIME_SLOTS.map((time) => {
          const isBooked = bookedTimes.includes(time);
          const isSelected = selectedTime === time;

          const isUnavailable =
            disabled ||
            isLoading ||
            isError ||
            isBooked;

          return (
            <button
              key={time}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectTime(time)}
              className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                isBooked
                  ? 'bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed'
                  : isUnavailable
                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                      : 'bg-blue-50/50 text-blue-600 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      {/* Status Message */}
      <p className="text-xs text-gray-400 pt-1 font-medium">
        {disabled
          ? 'Choose a date first.'
          : isLoading
            ? 'Checking available time slots...'
            : isError
              ? 'Could not check time slot availability.'
              : 'Strikethrough times are already booked.'}
      </p>
    </div>
  );
}