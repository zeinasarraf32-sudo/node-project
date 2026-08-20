import { Bell } from 'lucide-react';
import UpcomingCard from '@/components/dashboard/UpcomingCard';
import QuickActions from '@/components/dashboard/QuickActions';
import AIBanner from '@/components/dashboard/AIBanner';
import AppointmentHistory from '@/components/dashboard/AppointmentHistory';
import HealthSummary from '@/components/dashboard/HealthSummary';
import RecommendedDoctors from '@/components/dashboard/RecommendedDoctors';
import NotificationsList from '@/components/dashboard/NotificationsList';

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Good morning,</p>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Ali Hassan 👋
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Here's your health overview for today, August 4, 2026
          </p>
        </div>
        <button className="p-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 hover:text-gray-700 transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingCard />
          <QuickActions />
          <AIBanner />
          <AppointmentHistory />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <HealthSummary />
          <RecommendedDoctors />
          <NotificationsList />
        </div>
      </div>
    </div>
  );
}