import { CheckCircle2, Trash2, Circle } from 'lucide-react';
import { Task } from '../type/task';
import { useTasks } from './TaskContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';


interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggleStatus = async () => {
    try {
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      await updateTaskStatus(task.id, newStatus);
      addToast(`Task marked as ${newStatus}!`, 'success');
    } catch (err) {
      addToast('Failed to update task status', 'error');
      console.error('Failed to update task status:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        addToast('Task deleted successfully!', 'success');
      } catch (err) {
        addToast('Failed to delete task', 'error');
        console.error('Failed to delete task:', err);
      }
    }
  };

  const priorityColors = {
    Low: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
    Medium: isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    High: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
  };

  const statusColors = {
    Pending: isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
    Completed: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleStatus}
          className={`mt-1 transition-colors flex-shrink-0 ${isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}
          title={task.status === 'Pending' ? 'Mark as completed' : 'Mark as pending'}
        >
          {task.status === 'Completed' ? (
            <CheckCircle2 size={24} className="text-green-600" />
          ) : (
            <Circle size={24} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              task.status === 'Completed'
                ? `line-through ${isDark ? 'text-gray-500' : 'text-gray-500'}`
                : isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{formatDate(task.due_date)}</span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className={`transition-colors flex-shrink-0 ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
          title="Delete task"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
