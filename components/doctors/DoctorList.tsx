import DoctorCard, { Doctor } from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
}

export default function DoctorList({ doctors }: DoctorListProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Showing <span className="font-bold text-gray-900">{doctors.length}</span> doctors
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}