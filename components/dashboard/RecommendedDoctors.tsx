'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

const RECOMMENDED = [
  {
    id: '1',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    rating: 4.8,
  },
];

export default function RecommendedDoctors() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Recommended</h2>
        <Link href="/doctors" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
          See all
        </Link>
      </div>

      <div className="space-y-3">
        {RECOMMENDED.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                {doc.name.slice(4, 6).toUpperCase()}
              </div>
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

      <Link
        href="/doctors"
        className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2.5 rounded-2xl text-xs transition"
      >
        Book Appointment
      </Link>
    </div>
  );
}