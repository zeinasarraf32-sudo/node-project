'use client';

import { useState } from 'react';
import { Star, MapPin, Clock, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating?: number;
  location: string;
  price: number;
  availabilityStatus: string;
  availableTimes?: string[];
  image?: string | null;
  imageUrl?: string | null;
}

// صورة افتراضية خارجية شغال معتمدة تجنباً لخطأ 404
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300';

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const isAvailableToday = doctor?.availabilityStatus === 'Available Today';

  // معالجة رابط الصورة للحماية من null
  const doctorImg = doctor?.image || doctor?.imageUrl || DEFAULT_AVATAR;

  const handleBooking = () => {
    setBookingStatus('loading');

    setTimeout(() => {
      setBookingStatus('success');

      setTimeout(() => {
        const isAuthenticated =
          typeof window !== 'undefined' &&
          Boolean(localStorage.getItem('token') || localStorage.getItem('user'));

        if (isAuthenticated) {
          router.push(`/booking/${doctor.id}`);
        } else {
          router.push(`/login?redirectTo=/booking/${doctor.id}`);
        }
      }, 600);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={doctorImg}
            alt={doctor?.name || 'Doctor Image'}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              // إذا فشل تحميل الصورة لسبب ما، يتم التبديل فوراً للصورة الافتراضية
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
              isAvailableToday
                ? 'bg-emerald-100/90 text-emerald-700 backdrop-blur-sm'
                : 'bg-white/90 text-gray-700 backdrop-blur-sm'
            }`}
          >
            {doctor?.availabilityStatus || 'Available'}
          </span>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
            ${doctor?.price ?? 0}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{doctor?.name || 'Doctor Name'}</h3>
              <p className="text-blue-600 text-xs font-medium mt-0.5">
                {doctor?.specialty || 'General'} · {doctor?.experienceYears ?? 0} y exp
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{Number(doctor?.rating || 5).toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{doctor?.location || 'Location unavailable'}</span>
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Available Times</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(doctor?.availableTimes || ['09:00 AM', '02:00 PM']).map((time, idx) => (
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
        <button 
          onClick={() => router.push(`/booking/${doctor.id}`)}
          className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl text-xs transition"
        >
          View Profile
        </button>

        <button
          onClick={handleBooking}
          disabled={bookingStatus !== 'idle'}
          className={`flex-1 font-medium py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5 ${
            bookingStatus === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {bookingStatus === 'loading' && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Booking...</span>
            </>
          )}
          {bookingStatus === 'success' && (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Redirecting...</span>
            </>
          )}
          {bookingStatus === 'idle' && <span>Book Now</span>}
        </button>
      </div>
    </div>
  );
}