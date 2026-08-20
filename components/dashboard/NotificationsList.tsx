const NOTIFS = [
    { id: '1', text: 'Appointment confirmed with Dr. Al-Halabi', time: '2h ago', color: 'bg-blue-500' },
    { id: '2', text: 'Prescription renewal reminder', time: '1d ago', color: 'bg-amber-500' },
    { id: '3', text: 'Lab results are ready to view', time: '3d ago', color: 'bg-emerald-500' },
  ];
  
  export default function NotificationsList() {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
        <div className="space-y-3.5">
          {NOTIFS.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full ${item.color} mt-1.5 shrink-0`} />
              <div>
                <p className="text-xs font-medium text-gray-800">{item.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }