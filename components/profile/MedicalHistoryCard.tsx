import { FileText, AlertCircle, Info } from 'lucide-react';

export default function MedicalHistoryCard() {
  const conditions = [
    { title: 'Hypertension', since: '2021', status: 'Managed', iconType: 'warning' },
    { title: 'Type 2 Diabetes', since: '2022', status: 'Managed', iconType: 'warning' },
    { title: 'Seasonal Allergies', since: '2018', status: 'Managed', iconType: 'info' },
  ];

  const medications = [
    { name: 'Metformin 500mg', dosage: 'Twice daily', refill: 'Aug 20, 2026' },
    { name: 'Lisinopril 10mg', dosage: 'Once daily', refill: 'Sep 5, 2026' },
    { name: 'Cetirizine 10mg', dosage: 'As needed', refill: 'Oct 1, 2026' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 text-gray-900">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-base">Medical History</h3>
      </div>

      <div className="space-y-3">
        {conditions.map((item) => (
          <div
            key={item.title}
            className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  item.iconType === 'warning'
                    ? 'bg-amber-100/70 text-amber-600'
                    : 'bg-blue-100/70 text-blue-600'
                }`}
              >
                {item.iconType === 'warning' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium">
                  Since {item.since}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 font-semibold text-xs rounded-full ${
                item.iconType === 'warning'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 space-y-4">
        <h4 className="font-bold text-sm text-gray-900">Current Medications</h4>
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.name}
              className="p-4 bg-blue-50/40 border border-blue-100/60 rounded-2xl flex items-center justify-between"
            >
              <div>
                <h5 className="font-bold text-sm text-gray-900">{med.name}</h5>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {med.dosage}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400 font-medium">Refill due</p>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {med.refill}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}