'use client';

import { Star, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  location: string;
  price: number;
  availabilityStatus: string;
  availableTimes: string[];
  image: string;
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const isAvailableToday = doctor.availabilityStatus === 'Available Today';

  const handleBooking = () => {
    // 1. Check authentication status (e.g. token in localStorage or cookie)
    // Replace 'token' or 'user' with whatever key you use to store auth state locally
    const isAuthenticated = typeof window !== 'undefined' && Boolean(localStorage.getItem('token') || localStorage.getItem('user'));

    if (isAuthenticated) {
      // 2. Go straight to booking page with doctor ID
      router.push(`/booking/${doctor.id}`);
    } else {
      // 3. Redirect to login and pass destination as query parameter
      router.push(`/login?redirectTo=/booking/${doctor.id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
          />
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
              isAvailableToday
                ? 'bg-emerald-100/90 text-emerald-700 backdrop-blur-sm'
                : 'bg-white/90 text-gray-700 backdrop-blur-sm'
            }`}
          >
            {doctor.availabilityStatus}
          </span>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
            ${doctor.price}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{doctor.name}</h3>
              <p className="text-blue-600 text-xs font-medium mt-0.5">
                {doctor.specialty} · {doctor.experienceYears} y exp
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{doctor.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate dir-rtl">{doctor.location}</span>
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Available Times</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableTimes.map((time, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50/80 text-blue-600 text-xs px-2.5 py-1 rounded-lg font-medium"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2">
        <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl text-xs transition">
          View Profile
        </button>
        <button
          onClick={handleBooking}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-xs transition shadow-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}