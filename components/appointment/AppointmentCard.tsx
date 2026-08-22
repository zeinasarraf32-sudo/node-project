import { Calendar, Clock, MapPin, Video, MoreVertical, X } from 'lucide-react';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  avatar: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  date: string;
  time: string;
  location: string;
  type: 'in-person' | 'telehealth';
}

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const isConfirmed = appointment.status === 'Confirmed';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={appointment.avatar}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{appointment.doctorName}</h3>
            <p className="text-blue-600 text-sm font-medium">{appointment.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isConfirmed ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {appointment.status}
          </span>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {appointment.type === 'telehealth' ? (
            <>
              <Video className="w-4 h-4 text-gray-400" />
              <span>{appointment.location}</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{appointment.location}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {appointment.type === 'telehealth' ? (
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition">
            <Video className="w-4 h-4" />
            Join Call
          </button>
        ) : (
          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2.5 px-4 rounded-xl text-sm transition">
            View Details
          </button>
        )}

        <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm transition text-center">
          Reschedule
        </button>

        <button className="p-2.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}