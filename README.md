# Task Management Dashboard

A modern, feature-rich task management web application built with React, TypeScript, and Vite. This dashboard provides a complete solution for managing tasks with filtering, sorting, persistence, and an intuitive user interface.

## 📋 Features

### ✅ Core Requirements
- **Task List Page** - Display tasks with title, description, status, and creation date
- **Task Management** - View, add, mark complete, and delete tasks
- **Form Validation** - Title field validation with error messages
- **Filtering** - Filter by All, Completed, and Pending status
- **Sorting** - Sort by Created Date and Priority (ascending/descending)
- **API Integration** - Fetch initial data from JSONPlaceholder API
- **State Management** - React Context API for auth and component state
- **Loading & Error States** - Proper UX feedback for data fetching
- **Responsive Design** - Mobile-first approach, works on all devices
- **Modern UI** - Clean design with Tailwind CSS and Lucide icons

### 🎁 Bonus Features
- **✨ Dark Mode** - Toggle between light and dark themes (persistent)
- **💾 localStorage Persistence** - Tasks and preferences auto-save
- **✏️ Edit Functionality** - Modify existing tasks with modal UI
- **🔐 Authentication** - Protected routes with login page
- **📊 Dashboard Analytics** - Stats cards and activity tracking
- **🎨 Dark Mode Typography** - Fully styled dark mode UI
- **⚡ Debounced Search** - Efficient search with 300ms delay
- **📱 Mobile Navigation** - Hamburger menu for tablet/mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/danish2026/task-management-web.git
cd task-management-web

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Type check
npm run typecheck
```

## 🔑 Demo Credentials

For testing the protected dashboard:
- **Username:** `admin`
- **Password:** `admin123`

These credentials are displayed on the login page for convenience.

## 📁 Project Structure

```
src/
├── components/
│   ├── addTaskForm.tsx          # Task creation form component
│   ├── dashBord.tsx             # Dashboard stats display
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   ├── Sidebar.tsx              # Navigation sidebar with menu
│   ├── TaskContext.tsx          # Task context (alternate hook)
│   └── taskItem.tsx             # Individual task card component
│
├── config/
│   ├── api.ts                   # API endpoint constants
│   └── apiClient.ts             # Axios client with interceptors
│
├── context/
│   ├── AuthContext.tsx          # Authentication state management
│   └── TaskContext.tsx          # Task context provider
│
├── lib/
│   └── supabase.tsx             # Supabase client initialization
│
├── pages/
│   ├── Login.tsx                # Authentication page
│   ├── Dashboard.tsx            # Main layout wrapper
│   ├── DashboardHome.tsx        # Dashboard overview page
│   ├── TasksPage.tsx            # Main task management page
│   ├── UsersPage.tsx            # Users (placeholder)
│   ├── ContentPage.tsx          # Content (placeholder)
│   └── SettingsPage.tsx         # Settings (placeholder)
│
├── type/
│   ├── task.ts                  # Task types and interfaces
│   └── database.ts              # Supabase schema types
│
├── App.tsx                       # Main app routing
├── main.tsx                      # React entry point
└── index.css                     # Tailwind imports
```

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18.3.1 + TypeScript 5.5.3 |
| **Build Tool** | Vite 5.4.2 |
| **Routing** | React Router DOM 7.13.0 |
| **Styling** | Tailwind CSS 3.4.1 |
| **HTTP Client** | Axios 1.13.5 |
| **Icons** | Lucide React 0.344.0 |
| **State** | React Context API + useState |
| **Backend Ready** | Supabase JS 2.57.4 |
| **Linting** | ESLint 9.9.1 |

### State Management

- **Authentication:** React Context (`AuthContext.tsx`) - Manages login/logout and protected routes
- **Tasks:** Component state with localStorage sync - Reduces boilerplate while maintaining persistence
- **UI State:** Component-level state for modals, filters, dark mode

### Data Flow

```
App (BrowserRouter)
├── AuthProvider
│   └── Routes
│       ├── /login → Login (public)
│       └── /dashboard → Protected
│           ├── DashboardHome
│           ├── TasksPage ← Main feature
│           ├── UsersPage
│           ├── ContentPage
│           └── SettingsPage
```

## 📝 API Integration

### Initial Data Fetching

The TasksPage fetches initial tasks from:
```
https://jsonplaceholder.typicode.com/todos?_limit=5
```

**Response Mapping:**
```typescript
{
  id: importedId,
  title: "API task title",
  description: "",           // Not in API response
  status: completed ? "Completed" : "Pending",
  priority: "Medium",        // Default priority
  dueDate: "",              // Set by user
  createdAt: new Date()
}
```

### Error Handling

- Falls back to placeholder tasks if API fails
- Displays error message in UI but doesn't block functionality
- Uses localStorage cache to prevent re-fetching

## 💾 Data Persistence

### localStorage Keys

| Key | Purpose | Type |
|-----|---------|------|
| `task_mgmt_tasks` | All tasks | JSON array |
| `task_mgmt_dark` | Dark mode preference | boolean |
| `isAuthenticated` | Auth session | boolean |
| `token` | Bearer token (ready) | string |

### Auto-Sync

- Tasks sync after every change (add/edit/delete)
- Dark mode preference saved on toggle
- No manual action required from user

## 🔐 Authentication

### Current Implementation
- **Simple authentication** with hardcoded credentials
- **localStorage-based sessions** for development
- **Protected routes** via `ProtectedRoute` component
- **Auto-redirect** on 401 errors (via axios interceptor)

### For Production

Replace the hardcoded credentials in `AuthContext.tsx` with:
```typescript
// Replace the login function with your backend API call
const response = await POST('/auth/login', { username, password });
localStorage.setItem('token', response.token);
```

## 🎯 Requirements Checklist

### Core Requirements ✅
- [x] Task List Page with title, description, status, creation date
- [x] Action buttons (Mark complete, Delete)
- [x] Add Task form with validation
- [x] Filter by All/Completed/Pending
- [x] Sort by Created Date and Priority
- [x] API integration with error handling
- [x] Loading and error states
- [x] State management
- [x] Responsive UI design
- [x] Proper styling

### Bonus Requirements ✅
- [x] **localStorage persistence** - Full task persistence with cache
- [x] **Edit functionality** - Modal-based task editing
- [x] **Dark mode** - Toggle with persistent preference
- [x] **Advanced search** - Debounced search input
- [x] **Dashboard stats** - Task statistics cards
- [x] **Mobile navigation** - Hamburger menu for responsive design

## 🧪 Testing the Application

### Demo Workflows

**1. Login**
```
1. Navigate to http://localhost:5173/login
2. Enter: admin / admin123
3. Click "Sign In"
```

**2. Add a Task**
```
1. Click "Add Task" button
2. Fill in title (required)
3. Optional: Add description, due date, priority
4. Click "Add Task"
```

**3. Filter & Sort**
```
1. Use filter buttons: All, Completed, Pending
2. Use sort buttons: Date (asc/desc), Priority (asc/desc)
```

**4. Search**
```
1. Type in search box
2. Results filter automatically (with 300ms debounce)
```

**5. Edit Task**
```
1. Click edit icon (pencil) on any task
2. Modal opens with current task details
3. Modify fields and click "Save Changes"
```

**6. Dark Mode**
```
1. Click sun/moon icon in header
2. Preference persists on page reload
```

## 🔧 Development Assumptions

### Design Decisions

1. **No Database Required** - Tasks use localStorage only (suitable for client-side demos)
2. **Simple Auth** - Hardcoded credentials for development (replace for production)
3. **Placeholder Pages** - Users, Content, Settings pages show empty states (expandable)
4. **Component-Level State** - Tasks managed in component rather than global context (simpler, adequate for this scope)
5. **Debounced Search** - 300ms delay prevents excessive re-renders
6. **Dark Mode Classes** - Uses Tailwind's `dark:` utility classes (no external library)

### Assumptions Made

1. **User Personas**: Single admin user managing tasks personally
2. **Data Volume**: Up to 100-200 tasks (localStorage performant for this range)
3. **Offline-First**: Application prioritizes offline functionality
4. **Browser Support**: Modern browsers (ES2020+)
5. **Mobile**: Tablet and above (no specific mobile-first API changes)
6. **API Fallback**: JSONPlaceholder failure is handled gracefully

## 🚀 Production Considerations

### Before Deploying

1. **Replace Demo Auth**
   ```typescript
   // In AuthContext.tsx
   const response = await POST('/auth/login', { username, password });
   ```

2. **Connect Real Backend**
   ```typescript
   // Update apiClient.ts baseURL
   const ApiBaseUrl = process.env.REACT_APP_API_BASE_URL
   ```

3. **Enable Supabase** (Already configured)
   ```typescript
   // In lib/supabase.tsx, use the client for API calls
   await supabase.from('tasks').select()
   ```

4. **Environment Variables**
   ```bash
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   REACT_APP_API_BASE_URL=your_api_url
   ```

5. **Build & Deploy**
   ```bash
   npm run build
   # Deploy dist/ folder to hosting
   ```

### Deployment Options

- **Vercel** (recommended for Vite) - One-click deployment
- **Netlify** - Auto build on git push
- **Docker** - Containerized deployment
- **GitHub Pages** - Static hosting

## 📊 Performance Optimizations

- **Code Splitting** - React Router lazy loading ready
- **Debounced Search** - Prevents excessive re-renders
- **localStorage Caching** - Avoids API calls on reload
- **Tailwind Purging** - Only included CSS is bundled
- **Vite Optimizations** - Fast HMR and build times

## 🐛 Troubleshooting

### Tasks Not Persisting
- Check browser localStorage (DevTools → Application → Storage)
- Clear localStorage if corrupted: `localStorage.clear()`

### Dark Mode Not Working
- Ensure `dark` class is applied to parent element
- Check Tailwind config: `darkMode: 'class'`

### API Fetch Fails
- Verify internet connection
- Check browser console for CORS errors
- Fallback tasks display automatically

### Authentication Issues
- Ensure cookies/localStorage are enabled
- Check if token is in localStorage: `localStorage.getItem('token')`

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Danish**  
GitHub: [@danish2026](https://github.com/danish2026)

---

**Last Updated:** February 21, 2026  
**Status:** ✅ Production Ready (with optional backend integration)
