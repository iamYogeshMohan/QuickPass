import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HostDashboard from './pages/HostDashboard';
import SecurityScanner from './pages/SecurityScanner';
import AdminDashboard from './pages/AdminDashboard';
import VisitorView from './pages/VisitorView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'host') return '/dashboard';
    if (user.role === 'security') return '/scanner';
    if (user.role === 'admin') return '/admin';
    return '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={getDashboardPath()} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardPath()} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboardPath()} />} />
        
        {/* Public Visitor Link Route */}
        <Route path="/v/:id" element={<VisitorView />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['host', 'admin']} />}>
          <Route path="/dashboard" element={<HostDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['security', 'admin']} />}>
          <Route path="/scanner" element={<SecurityScanner />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
