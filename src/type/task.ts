export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';
export type FilterType = 'All' | 'Completed' | 'Pending';
export type SortType = 'created_date' | 'priority';

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: Priority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
}
