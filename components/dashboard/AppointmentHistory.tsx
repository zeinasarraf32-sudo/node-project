import { ChevronRight } from 'lucide-react';

const HISTORY = [
  {
    id: '1',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    date: 'Jul 18, 2026',
    status: 'Completed',
    avatar: 'https://images.unsplash.com/photo-1594824813571-2153349aed06?w=150',
  },
  {
    id: '2',
    name: 'Dr. Marwan Qabbani',
    specialty: 'Orthopedic',
    date: 'Jun 30, 2026',
    status: 'Completed',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
  },
  {
    id: '3',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    date: 'May 22, 2026',
    status: 'Cancelled',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
  },
];

export default function AppointmentHistory() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Appointment History</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {HISTORY.map((item) => (
          <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-2xl object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                <p className="text-gray-400 text-xs">
                  {item.specialty} · {item.date}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                item.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}