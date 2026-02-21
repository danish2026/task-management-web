import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from './TaskContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Priority } from '../type/task';

export function AddTaskForm() {
  const { addTask } = useTasks();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        priority,
      });

      addToast('Task created successfully!', 'success');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setIsOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add task';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
      >
        <Plus size={20} />
        Add New Task
      </button>
    );
  }

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
            placeholder="Enter task description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          </div>

          <div>
            <label htmlFor="priority" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {error && (
          <div className={`border px-4 py-3 rounded-lg text-sm ${isDark ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle('');
              setDescription('');
              setDueDate('');
              setPriority('Medium');
              setError('');
            }}
            className={`px-6 py-2 border font-medium rounded-lg transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
