'use client';

import DoctorCard, { Doctor } from './DoctorCard';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

interface DoctorListProps {
  doctors?: Doctor[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export default function DoctorList({
  doctors = [],
  isLoading = false,
  isError = false,
  onRetry,
}: DoctorListProps) {
  // 2️⃣ Loading State
  if (isLoading) {
    return <LoadingState message="Loading doctors list..." />;
  }

  // 4️⃣ Error State
  if (isError) {
    return (
      <ErrorState
        message="Unable to load doctors. Please check your connection."
        onRetry={onRetry}
      />
    );
  }

  // 3️⃣ Empty State
  if (doctors.length === 0) {
    return (
      <EmptyState
        title="No Doctors Found"
        description="There are no doctors matching your search criteria or available right now."
      />
    );
  }

  // 1️⃣ Default State
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