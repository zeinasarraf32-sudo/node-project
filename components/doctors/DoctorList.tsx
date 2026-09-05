'use client';

import DoctorCard, {
  Doctor,
} from './DoctorCard';

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
  if (isLoading) {
    return (
      <LoadingState message="Loading doctors list..." />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load doctors. Please check your connection."
        onRetry={onRetry}
      />
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        title="No Doctors Found"
        description="We couldn't find any doctors matching your search criteria."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500">
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {doctors.length}
          </span>{' '}
          doctors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
          />
        ))}
      </div>
    </div>
  );
}