const SPECIALTIES = [
  'All Specialties',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Dermatologist',
  'General Practice',
];

interface DoctorFiltersProps {
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
}

export default function DoctorFilters({
  selectedSpecialty,
  setSelectedSpecialty,
}: DoctorFiltersProps) {
  return (
    /* flex-wrap تجعل التخصصات تنزل لسطر جديد وتظهر كاملة على الموبايل */
    <div className="flex flex-wrap items-center gap-2 my-3 w-full">
      {SPECIALTIES.map((specialty) => {
        const isActive = selectedSpecialty === specialty;
        return (
          <button
            key={specialty}
            onClick={() => setSelectedSpecialty(specialty)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
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