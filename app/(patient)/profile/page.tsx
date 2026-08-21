'use client';

import { Pencil } from 'lucide-react';
import AvatarCard from '@/components/profile/AvatarCard';
import InsuranceCard from '@/components/profile/InsuranceCard';
import NotificationsCard from '@/components/profile/NotificationsCard';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import MedicalHistoryCard from '@/components/profile/MedicalHistoryCard';

export default function ProfilePage() {
  const user = {
    fullName: 'Ali Hassan',
    patientId: '#MG-2024-001',
    dob: 'March 12, 1992',
    email: 'ali.hassan@email.com',
    phone: '+961 71 234 567',
    gender: 'Male',
    bloodType: 'O+',
    address: 'Al-Mina Street, Tripoli, Lebanon',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    insurance: {
      provider: 'Lebanese Social Security',
      memberId: 'LB-SS-2024-87432',
      isActive: true,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal and medical information
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition flex items-center gap-2 shadow-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <AvatarCard
            name={user.fullName}
            patientId={user.patientId}
            bloodType={user.bloodType}
            avatarUrl={user.avatarUrl}
          />
          <InsuranceCard
            provider={user.insurance.provider}
            memberId={user.insurance.memberId}
            isActive={user.insurance.isActive}
          />
          <NotificationsCard />
        </div>

        {/* Right Column Main Body */}
        <div className="lg:col-span-8 space-y-6">
          <PersonalInfoCard
            fullName={user.fullName}
            dob={user.dob}
            email={user.email}
            phone={user.phone}
            gender={user.gender}
            bloodType={user.bloodType}
            address={user.address}
          />
          <MedicalHistoryCard />
        </div>
      </div>
    </div>
  );
}