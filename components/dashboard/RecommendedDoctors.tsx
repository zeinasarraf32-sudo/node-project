import { Star } from 'lucide-react';

const RECOMMENDED = [
  {
    id: '1',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1594824813571-2153349aed06?w=150',
  },
  {
    id: '2',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
  },
];

export default function RecommendedDoctors() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Recommended</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">See all</button>
      </div>

      <div className="space-y-3">
        {RECOMMENDED.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={doc.avatar} alt={doc.name} className="w-11 h-11 rounded-2xl object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{doc.name}</h4>
                <p className="text-gray-400 text-xs">{doc.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{doc.rating}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2.5 rounded-2xl text-xs transition">
        Book Appointment
      </button>
    </div>
  );
}