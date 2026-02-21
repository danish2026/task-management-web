import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <Sidebar />
      <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Outlet />
      </main>
    </div>
  );
}
