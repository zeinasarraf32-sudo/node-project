import { Calendar, Clock } from 'lucide-react';

export default function UpcomingCard() {
  return (
    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-90">Upcoming Appointment</span>
        <span className="bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full font-semibold">
          Next
        </span>
      </div>

      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
          alt="Dr. Sara Al-Halabi"
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
        />
        <div>
          <h3 className="text-xl font-bold">Dr. Sara Al-Halabi</h3>
          <p className="text-blue-100 text-sm font-medium">Cardiologist</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="bg-white/15 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Monday, August 7, 2026
            </span>
            <span className="bg-white/15 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              10:00 AM
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="flex-1 bg-white hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-2xl text-sm transition">
          View Details
        </button>
        <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-2xl text-sm transition">
          Reschedule
        </button>
      </div>
    </div>
  );
}