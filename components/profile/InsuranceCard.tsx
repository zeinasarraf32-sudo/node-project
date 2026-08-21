import { ShieldCheck } from 'lucide-react';

interface InsuranceCardProps {
  provider: string;
  memberId: string;
  isActive: boolean;
}

export default function InsuranceCard({
  provider,
  memberId,
  isActive,
}: InsuranceCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 text-gray-900">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-base">Insurance</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 font-medium">Provider</p>
          <p className="text-sm font-bold text-gray-800">{provider}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Member ID</p>
          <p className="text-sm font-bold text-gray-800">{memberId}</p>
        </div>

        {isActive && (
          <div className="pt-1">
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Insurance Active
            </div>
          </div>
        )}
      </div>
    </div>
  );
}