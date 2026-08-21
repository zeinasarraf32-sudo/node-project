'use client';

import { CheckCircle2, Star } from 'lucide-react';
import Image from 'next/image';

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

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctorId: string;
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorSelector({ doctors, selectedDoctorId, onSelect }: DoctorSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
          1
        </span>
        <h2 className="text-lg font-bold text-gray-900">Select Doctor</h2>
      </div>

      <div className="space-y-3">
        {doctors.map((doc) => {
          const isSelected = doc.id === selectedDoctorId;
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