import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FilterType, SortType, Task, TaskFormData } from '../type/task';
import { supabase } from '../lib/supabase';


interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
  sortBy: SortType;
  setFilter: (filter: FilterType) => void;
  setSortBy: (sortBy: SortType) => void;
  addTask: (taskData: TaskFormData) => Promise<void>;
  updateTaskStatus: (id: string, status: 'Pending' | 'Completed') => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');
  const [sortBy, setSortBy] = useState<SortType>('created_date');

  const fetchInitialData = async () => {
    try {
      const { data: existingTasks, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (!existingTasks || existingTasks.length === 0) {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const apiTasks = await response.json();

        const mappedTasks = apiTasks.map((task: { id: number; title: string; completed: boolean }) => ({
          title: task.title,
          description: `Task imported from API (ID: ${task.id})`,
          due_date: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          status: task.completed ? 'Completed' as const : 'Pending' as const,
        }));

        const { data: insertedTasks, error: insertError } = await supabase
          .from('tasks')
          .insert(mappedTasks)
          .select();

        if (insertError) throw insertError;
        setTasks((insertedTasks as Task[]) || []);
      } else {
        setTasks(existingTasks as Task[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const refreshTasks = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks((data as Task[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh tasks');
    }
  };

  const addTask = async (taskData: TaskFormData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date || null,
          priority: taskData.priority,
          status: 'Pending',
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setTasks((prev) => [data as Task, ...prev]);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const updateTaskStatus = async (id: string, status: 'Pending' | 'Completed') => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status, updated_at: new Date().toISOString() } : task
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const getFilteredAndSortedTasks = (): Task[] => {
    let filtered = [...tasks];

    if (filter === 'Completed') {
      filtered = filtered.filter((task) => task.status === 'Completed');
    } else if (filter === 'Pending') {
      filtered = filtered.filter((task) => task.status === 'Pending');
    }

    filtered.sort((a, b) => {
      if (sortBy === 'created_date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

    return filtered;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
    highPriority: tasks.filter((task) => task.priority === 'High').length,
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks: getFilteredAndSortedTasks(),
        loading,
        error,
        filter,
        sortBy,
        setFilter,
        setSortBy,
        addTask,
        updateTaskStatus,
        deleteTask,
        refreshTasks,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
