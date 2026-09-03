'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { axiosGet } from '@/lib/axios';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  fee: number;
  location: string;
}

interface BackendDoctor {
  id: string | number;
  fullName?: string;
  name?: string;
  specialty: string;
  consultationFee?: number;
  location?: string;
  imageUrl?: string;
}

interface DoctorSelectorProps {
  selectedDoctorId?: string;
  autoSelectId?: string; // 👈 تم إضافة الخاصية للاستقبال من الرابط
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorSelector({ 
  selectedDoctorId, 
  autoSelectId, 
  onSelect 
}: DoctorSelectorProps) {
  // جلب الأطباء من الباك إند
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => axiosGet<BackendDoctor[]>('doctors'),
  });

  const doctorsList = responseData?.data || [];

  // تحويل البيانات القادمة من الباك إند لشكل Doctor المتوافق
  const doctors: Doctor[] = doctorsList.map((doc) => ({
    id: String(doc.id),
    name: doc.fullName || doc.name || 'Dr. Unknown',
    specialty: doc.specialty || 'General',
    rating: 4.9,
    reviewsCount: 312,
    avatar: doc.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    fee: Number(doc.consultationFee) || 35,
    location: doc.location || 'Clinic Location',
  }));

  // 👈 التأثير التلقائي: يتم تشغيله فور وصول بيانات الأطباء من الـ API
  useEffect(() => {
    if (doctors.length > 0) {
      const targetId = autoSelectId || selectedDoctorId;
      if (targetId) {
        const found = doctors.find((d) => d.id === targetId);
        if (found) {
          onSelect(found);
          return;
        }
      }
      // اختيار أول طبيب تلقائياً إذا لم يتوفر ID أو لم يُعثر عليه
      if (!selectedDoctorId) {
        onSelect(doctors[0]);
      }
    }
  }, [responseData, autoSelectId]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          1
        </span>
        <h2 className="text-lg font-bold text-gray-900">Select Doctor</h2>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-xs">Loading doctors...</p>
          </div>
        )}

        {isError && (
          <div className="py-6 text-center text-rose-500 text-xs">
            Failed to load doctors list.
          </div>
        )}

        {!isLoading && doctors.length === 0 && (
          <div className="py-6 text-center text-slate-400 text-xs">
            No doctors available right now.
          </div>
        )}

        {doctors.map((doc) => {
          const isSelected = doc.id === (autoSelectId || selectedDoctorId);
          return (
            <div
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={doc.avatar}
                    alt={doc.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{doc.name}</h3>
                  <p className="text-xs text-blue-600 font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800">{doc.rating}</span>
                    <span>({doc.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}