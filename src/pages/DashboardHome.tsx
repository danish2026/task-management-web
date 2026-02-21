import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getTimeAgo(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(iso);
}

export default function DashboardHome() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = loadFromStorage<Task[]>('task_mgmt_tasks', []);
    setTasks(loadedTasks);
  }, []);

  const stats = [
    {
      icon: ClipboardList,
      label: 'Total Tasks',
      value: tasks.length.toString(),
      change: '+0%',
      color: 'bg-blue-500',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: tasks.filter(t => t.status === 'Completed').length.toString(),
      change: '+0%',
      color: 'bg-emerald-500',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: tasks.filter(t => t.status === 'Pending').length.toString(),
      change: '+0%',
      color: 'bg-orange-500',
    },
    {
      icon: AlertTriangle,
      label: 'High Priority',
      value: tasks.filter(t => t.priority === 'High').length.toString(),
      change: '+0%',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
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
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No tasks yet. Create your first task to get started.</p>
            ) : (
              tasks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 4)
                .map((task, index) => (
                  <div key={task.id} className={`flex items-start justify-between py-3 border-b last:border-0 gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${task.status === 'Completed' ? (isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through') : (isDark ? 'text-gray-100' : 'text-gray-900')}`}>
                        {task.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{getTimeAgo(task.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      task.status === 'Completed'
                        ? (isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                        : (isDark ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700')
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Task Summary</h2>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} flex items-center justify-between`}>
              <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Completion Rate</span>
              <span className={`text-lg font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {tasks.length > 0
                  ? `${Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'} flex items-center justify-between`}>
              <span className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Pending Tasks</span>
              <span className={`text-lg font-bold ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                {tasks.filter(t => t.status === 'Pending').length}
              </span>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-red-50'} flex items-center justify-between`}>
              <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>High Priority</span>
              <span className={`text-lg font-bold ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                {tasks.filter(t => t.priority === 'High').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
