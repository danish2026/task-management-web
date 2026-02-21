import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const stats = [
  { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'bg-blue-500' },
  { icon: FileText, label: 'Total Content', value: '856', change: '+8%', color: 'bg-green-500' },
  { icon: TrendingUp, label: 'Growth', value: '23%', change: '+5%', color: 'bg-orange-500' },
  { icon: Activity, label: 'Active Now', value: '89', change: '+3%', color: 'bg-purple-500' },
];

export default function DashboardHome() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '5 minutes ago' },
              { action: 'Content published', time: '12 minutes ago' },
              { action: 'Settings updated', time: '1 hour ago' },
              { action: 'Report generated', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className={`flex items-center justify-between py-3 border-b last:border-0 ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-100 text-gray-700'}`}>
                <span>{activity.action}</span>
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add User', color: 'bg-blue-600' },
              { label: 'Create Content', color: 'bg-green-600' },
              { label: 'View Reports', color: 'bg-orange-600' },
              { label: 'System Settings', color: 'bg-purple-600' },
            ].map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white py-4 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
