const SPECIALTIES = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'General Practice',
  ];
  
  interface DoctorFiltersProps {
    selectedSpecialty: string;
    setSelectedSpecialty: (specialty: string) => void;
  }
  
  export default function DoctorFilters({ selectedSpecialty, setSelectedSpecialty }: DoctorFiltersProps) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SPECIALTIES.map((specialty) => {
          const isActive = selectedSpecialty === specialty;
          return (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {specialty}
            </button>
          );
        })}
      </div>
    );
  }