// import { useTasks } from '../context/TaskContext';

import { useTasks } from "./TaskContext";

export function Dashboard() {
  const { stats } = useTasks();

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      label: 'Completed',
      value: stats.completed,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      label: 'Pending',
      value: stats.pending,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-lg p-6 shadow-sm`}
        >
          <div className={`text-4xl font-bold ${stat.textColor} mb-2`}>
            {stat.value}
          </div>
          <div className={`text-sm font-medium ${stat.textColor}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
