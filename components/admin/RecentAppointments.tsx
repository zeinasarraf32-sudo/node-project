import React from "react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: "Confirmed" | "Completed" | "Pending" | "Cancelled";
  avatarBg: string;
}

const appointments: Appointment[] = [
  { id: "1", patientName: "Ali Hassan", doctorName: "Dr. Al-Halabi", time: "Aug 4, 10:00 AM", status: "Confirmed", avatarBg: "bg-blue-100 text-blue-600" },
  { id: "2", patientName: "Rana Saad", doctorName: "Dr. Issa", time: "Aug 4, 11:30 AM", status: "Completed", avatarBg: "bg-indigo-100 text-indigo-600" },
  { id: "3", patientName: "Khalid Najm", doctorName: "Dr. Al-Rafi'i", time: "Aug 4, 2:00 PM", status: "Pending", avatarBg: "bg-sky-100 text-sky-600" },
  { id: "4", patientName: "Nour Al-Din", doctorName: "Dr. Karami", time: "Aug 4, 3:30 PM", status: "Confirmed", avatarBg: "bg-blue-100 text-blue-600" },
  { id: "5", patientName: "Maisa Taha", doctorName: "Dr. Salama", time: "Aug 4, 4:00 PM", status: "Cancelled", avatarBg: "bg-blue-100 text-blue-600" },
];

const statusStyles = {
  Confirmed: "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Cancelled: "bg-rose-50 text-rose-600",
};

export default function RecentAppointments() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 text-sm">Recent Appointments</h3>
        <button className="text-xs font-medium text-blue-600 hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {appointments.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${item.avatarBg}`}>
                {item.patientName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{item.patientName}</p>
                <p className="text-[11px] text-slate-400">{item.doctorName} • {item.time}</p>
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyles[item.status]}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}