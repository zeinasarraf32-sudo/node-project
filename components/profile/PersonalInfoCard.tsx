import { User, Calendar, Mail, Phone, Droplet, MapPin } from 'lucide-react';

interface PersonalInfoProps {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  gender: string;
  bloodType: string;
  address: string;
}

export default function PersonalInfoCard({
  fullName,
  dob,
  email,
  phone,
  gender,
  bloodType,
  address,
}: PersonalInfoProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 text-gray-900">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-base">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {fullName}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Date of Birth
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {dob}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {email}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Phone Number
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {phone}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Gender
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {gender}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5" /> Blood Type
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {bloodType}
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Address
          </label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800">
            {address}
          </div>
        </div>
      </div>
    </div>
  );
}