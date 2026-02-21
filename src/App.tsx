import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import UsersPage from './pages/UsersPage';
import ContentPage from './pages/ContentPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <ToastContainer />
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              >
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="content" element={<ContentPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="tasks" element={<TasksPage />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
