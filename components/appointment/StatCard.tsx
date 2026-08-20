interface StatCardProps {
    count: number;
    label: string;
    colorClass: string;
  }
  
  export default function StatCard({ count, label, colorClass }: StatCardProps) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colorClass}`}>{count}</span>
        <span className="text-gray-500 text-sm mt-1">{label}</span>
      </div>
    );
  }