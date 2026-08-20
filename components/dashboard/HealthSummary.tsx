import { Heart, Activity, TrendingUp } from 'lucide-react';

const METRICS = [
  { label: 'Blood Pressure', value: '120/80', status: 'Normal', icon: Heart, color: 'text-emerald-500' },
  { label: 'Heart Rate', value: '72 bpm', status: 'Normal', icon: Activity, color: 'text-emerald-500' },
  { label: 'BMI', value: '22.4', status: 'Healthy', icon: TrendingUp, color: 'text-emerald-500' },
];

export default function HealthSummary() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Health Summary</h2>
      <div className="space-y-4">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                  <p className="font-bold text-gray-900 text-sm">{metric.value}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold ${metric.color}`}>{metric.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}