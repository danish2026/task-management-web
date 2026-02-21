import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Search, Trash2, CheckCircle, Edit2, X,
  ChevronUp, ChevronDown, ClipboardList, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'Low' | 'Medium' | 'High';
type Status = 'Pending' | 'Completed';
type FilterType = 'All' | 'Completed' | 'Pending';
type SortType = 'createdAt' | 'priority';

interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

const PRIORITY_ORDER: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };

const PLACEHOLDER_TASKS: Task[] = [
  { id: 1001, title: 'Design landing page', description: 'Create wireframes and mockups for the new landing page', status: 'Pending', priority: 'High', dueDate: '2025-01-28', createdAt: '2025-01-20T09:00:00.000Z' },
  { id: 1002, title: 'Set up API integration', description: 'Connect backend REST APIs to the frontend', status: 'Completed', priority: 'Medium', dueDate: '2025-01-30', createdAt: '2025-01-21T10:00:00.000Z' },
  { id: 1003, title: 'Write unit tests', description: 'Add Jest tests for all utility functions', status: 'Pending', priority: 'Low', dueDate: '2025-02-02', createdAt: '2025-01-22T11:00:00.000Z' },
  { id: 1004, title: 'Code review session', description: 'Review pull requests from the development team', status: 'Pending', priority: 'High', dueDate: '2025-02-05', createdAt: '2025-01-23T12:00:00.000Z' },
  { id: 1005, title: 'Deploy to staging', description: 'Push latest build to the staging environment', status: 'Completed', priority: 'Medium', dueDate: '2025-02-08', createdAt: '2025-01-24T13:00:00.000Z' },
];

const STORAGE_KEY = 'task_mgmt_tasks';
const DARK_KEY = 'task_mgmt_dark';

const emptyForm: FormState = { title: '', description: '', dueDate: '', priority: 'Medium' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority, dark }: { priority: Priority; dark: boolean }) {
  const colors: Record<Priority, string> = {
    High: 'bg-red-100 text-red-700 dark-badge-red',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };
  const darkColors: Record<Priority, string> = {
    High: 'bg-red-900 text-red-200',
    Medium: 'bg-yellow-900 text-yellow-200',
    Low: 'bg-green-900 text-green-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dark ? darkColors[priority] : colors[priority]}`}>
      {priority}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, dark }: { status: Status; dark: boolean }) {
  const base = status === 'Completed'
    ? (dark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
    : (dark ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700');
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${base}`}>
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TasksPage() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEY, []));
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [sort, setSort] = useState<SortType>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchRaw, setSearchRaw] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editError, setEditError] = useState('');
  const nextId = useRef(2000);

  // ── Initial API fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    // Only fetch if no persisted tasks
    if (tasks.length === 0) {
      setLoading(true);
      setApiError('');
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: { id: number; title: string; completed: boolean }[]) => {
          const mapped: Task[] = data.map(t => ({
            id: t.id,
            title: t.title,
            description: '',
            status: t.completed ? 'Completed' : 'Pending',
            priority: 'Medium',
            dueDate: '',
            createdAt: new Date().toISOString(),
          }));
          const combined = [...PLACEHOLDER_TASKS, ...mapped];
          setTasks(combined);
          saveToStorage(STORAGE_KEY, combined);
        })
        .catch(() => {
          setApiError('Failed to fetch tasks from API. Showing placeholder data.');
          setTasks(PLACEHOLDER_TASKS);
          saveToStorage(STORAGE_KEY, PLACEHOLDER_TASKS);
        })
        .finally(() => setLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist tasks ──────────────────────────────────────────────────────────
  useEffect(() => { saveToStorage(STORAGE_KEY, tasks); }, [tasks]);

  // ── Debounced search ───────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((val: string) => {
    setSearchRaw(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = tasks
    .filter(t => filter === 'All' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sort === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    high: tasks.filter(t => t.priority === 'High').length,
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const markComplete = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));

  const deleteTask = (id: number) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    const newTask: Task = {
      id: nextId.current++,
      title: form.title.trim(),
      description: form.description.trim(),
      status: 'Pending',
      priority: form.priority,
      dueDate: form.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setForm(emptyForm);
    setFormError('');
    setShowForm(false);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditForm({ title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority });
    setEditError('');
  };

  const saveEdit = () => {
    if (!editForm.title.trim()) { setEditError('Title is required.'); return; }
    setTasks(prev => prev.map(t => t.id === editTask!.id
      ? { ...t, title: editForm.title.trim(), description: editForm.description.trim(), dueDate: editForm.dueDate, priority: editForm.priority }
      : t));
    setEditTask(null);
  };

  const toggleSort = (col: SortType) => {
    if (sort === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(col); setSortDir('desc'); }
  };

  // ── Theme classes ──────────────────────────────────────────────────────────
  const bg = dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const card = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputCls = dark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500';
  const tableTh = dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600';
  const tableTd = dark ? 'border-gray-700 text-gray-200' : 'border-gray-100 text-gray-700';
  const rowHover = dark ? 'hover:bg-gray-750' : 'hover:bg-gray-50';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen p-4 md:p-8 ${bg} transition-colors duration-200`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Manage and track your tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowForm(f => !f); setFormError(''); }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-blue-500 font-medium">Loading tasks…</span>
        </div>
      )}

      {apiError && !loading && (
        <div className={`flex items-start gap-2 p-3 mb-4 rounded-lg border ${dark ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{apiError}</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Tasks', value: stats.total, color: 'text-blue-500', bg: dark ? 'bg-blue-900/30' : 'bg-blue-50' },
              { label: 'Completed', value: stats.completed, color: 'text-emerald-500', bg: dark ? 'bg-emerald-900/30' : 'bg-emerald-50' },
              { label: 'Pending', value: stats.pending, color: 'text-orange-500', bg: dark ? 'bg-orange-900/30' : 'bg-orange-50' },
              { label: 'High Priority', value: stats.high, color: 'text-red-500', bg: dark ? 'bg-red-900/30' : 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`${card} ${s.bg} border rounded-xl p-4 flex flex-col items-center`}>
                <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
                <span className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Add Task Form ── */}
          {showForm && (
            <div className={`${card} border rounded-xl p-5 mb-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">New Task</h2>
                <button onClick={() => { setShowForm(false); setFormError(''); setForm(emptyForm); }}>
                  <X className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                    placeholder="Enter task title"
                    value={form.title}
                    onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormError(''); }}
                  />
                  {formError && <p className="text-red-500 text-xs mt-1">{formError}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 resize-none ${inputCls}`}
                    rows={2}
                    placeholder="Optional description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Due Date</label>
                  <input
                    type="date"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                  <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }}
                  className={`px-4 py-2 rounded-lg text-sm ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}

          {/* ── Search + Filter + Sort ── */}
          <div className={`${card} border rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center`}>
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${inputCls}`}
                placeholder="Search tasks…"
                value={searchRaw}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-1.5">
              {(['All', 'Completed', 'Pending'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Sort:</span>
              <button
                onClick={() => toggleSort('createdAt')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === 'createdAt'
                    ? 'bg-blue-600 text-white'
                    : dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Date
                {sort === 'createdAt' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>
              <button
                onClick={() => toggleSort('priority')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === 'priority'
                    ? 'bg-blue-600 text-white'
                    : dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Priority
                {sort === 'priority' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className={`${card} border rounded-xl shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={tableTh}>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs">Title</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs hidden sm:table-cell">Due Date</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs">Priority</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs">Status</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center py-12 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(task => (
                      <tr key={task.id} className={`border-t ${tableTd} ${rowHover} transition-colors`}>
                        <td className="px-4 py-3 font-medium max-w-[180px] truncate">{task.title}</td>
                        <td className={`px-4 py-3 hidden md:table-cell max-w-[200px] truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {task.description || <span className="italic text-gray-400">—</span>}
                        </td>
                        <td className={`px-4 py-3 hidden sm:table-cell whitespace-nowrap ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={task.priority} dark={dark} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} dark={dark} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => markComplete(task.id)}
                              disabled={task.status === 'Completed'}
                              title="Mark as Complete"
                              className={`p-1.5 rounded-lg transition-colors ${
                                task.status === 'Completed'
                                  ? 'opacity-30 cursor-not-allowed'
                                  : dark ? 'hover:bg-emerald-900/50 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEdit(task)}
                              title="Edit"
                              className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-blue-900/50 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete"
                              className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filtered.length > 0 && (
              <div className={`px-4 py-2 text-xs border-t ${dark ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                Showing {filtered.length} of {tasks.length} tasks
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Edit Modal ── */}
      {editTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl w-full max-w-md`}>
            <div className="flex items-center justify-between p-5 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}">
              <h2 className="text-base font-semibold">Edit Task</h2>
              <button onClick={() => setEditTask(null)}>
                <X className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                  value={editForm.title}
                  onChange={e => { setEditForm(f => ({ ...f, title: e.target.value })); setEditError(''); }}
                />
                {editError && <p className="text-red-500 text-xs mt-1">{editError}</p>}
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 resize-none ${inputCls}`}
                  rows={2}
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Due Date</label>
                  <input
                    type="date"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                    value={editForm.dueDate}
                    onChange={e => setEditForm(f => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                  <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${inputCls}`}
                    value={editForm.priority}
                    onChange={e => setEditForm(f => ({ ...f, priority: e.target.value as Priority }))}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={`flex justify-end gap-2 p-5 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
              <button
                onClick={() => setEditTask(null)}
                className={`px-4 py-2 rounded-lg text-sm ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
