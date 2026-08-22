'use client';

import { useState } from 'react';
import SearchBar from '@/components/doctors/SearchBar';
import DoctorFilters from '@/components/doctors/DoctorFilters';
import DoctorList from '@/components/doctors/DoctorList';
import AIRecommendation from '@/components/doctors/AIRecommendation';
import { Doctor } from '@/components/doctors/DoctorCard';

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sara Al-Halabi',
    specialty: 'Cardiologist',
    experienceYears: 15,
    rating: 4.9,
    location: 'مستشفى الرمل، طرابلس',
    price: 35,
    availabilityStatus: 'Available Today',
    availableTimes: ['9:00 AM', '11:30 AM', '2:00 PM'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500',
  },
  {
    id: '2',
    name: 'Dr. Jamal Issa',
    specialty: 'Neurologist',
    experienceYears: 12,
    rating: 4.8,
    location: 'عيادة النور، شارع المطران، طرابلس',
    price: 40,
    availabilityStatus: 'Available Today',
    availableTimes: ['10:00 AM', '3:30 PM'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500',
  },
  {
    id: '3',
    name: "Dr. Layla Al-Rafi'i",
    specialty: 'Pediatrician',
    experienceYears: 10,
    rating: 4.9,
    location: 'مركز الأطفال الصحي، أبو سمراء، طرابلس',
    price: 25,
    availabilityStatus: 'Available Today',
    availableTimes: ['8:30 AM', '10:00 AM', '1:00 PM', '4:30 PM'],
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'Dr. Marwan Qabbani',
    specialty: 'Orthopedic',
    experienceYears: 18,
    rating: 4.7,
    location: 'مستشفى السلام، الميناء، طرابلس',
    price: 45,
    availabilityStatus: 'Next Available Thu',
    availableTimes: ['2:00 PM', '5:00 PM'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500',
  },
  {
    id: '5',
    name: 'Dr. Anisa Karami',
    specialty: 'Dermatologist',
    experienceYears: 9,
    rating: 4.9,
    location: 'عيادة الجادبة، القبة، طرابلس',
    price: 30,
    availabilityStatus: 'Available Today',
    availableTimes: ['9:30 AM', '12:00 PM', '3:00 PM'],
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '6',
    name: 'Dr. Tariq Salama',
    specialty: 'General Practice',
    experienceYears: 20,
    rating: 4.6,
    location: 'المركز الصحي العام، التل، طرابلس',
    price: 10,
    availabilityStatus: 'Available Today',
    availableTimes: ['8:00 AM', '9:00 AM', '11:00 AM', '4:00 PM'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500',
  },
];

export default function FindDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [sortBy, setSortBy] = useState('rating');

  const filteredDoctors = mockDoctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse verified specialists across all medical fields
        </p>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <DoctorFilters
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
      />

      <DoctorList
        doctors={filteredDoctors}
        isLoading={false}
        isError={false}
      />

      {/* Floating AI Widgets */}
      <AIRecommendation />
    </div>
  );
}