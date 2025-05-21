import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'; // Renommé Routes en RouterRoutes
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ActivityDetails from './pages/ActivityDetails';
import { AuthProvider, useAuth } from './hooks/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

const AppRoutes = () => { // Renommé la fonction en AppRoutes
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('token_expires_at');
    const now = Date.now();

    if (token && expiresAt && now < Number(expiresAt)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expires_at');
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  return (
    <RouterRoutes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/activity/:id" element={isAuthenticated ? <ActivityDetails /> : <Navigate to="/" />} />
    </RouterRoutes>
  );
};

export default App;
