import Image from 'next/image';

interface AvatarCardProps {
  name: string;
  patientId: string;
  bloodType: string;
  avatarUrl: string;
}

export default function AvatarCard({
  name,
  patientId,
  bloodType,
  avatarUrl,
}: AvatarCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
      <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden bg-gray-100 shadow-inner">
        <Image src={avatarUrl} alt={name} fill className="object-cover" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Patient ID: {patientId}
        </p>
      </div>
      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-semibold text-xs rounded-full">
        Blood Type: {bloodType}
      </div>
    </div>
  );
}