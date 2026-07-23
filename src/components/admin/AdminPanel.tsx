import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { useCMS } from '../../contexts/CMSContext';
import { authService } from '../../services/auth.service';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { setEditMode } = useCMS();
  const navigate = useNavigate();

  // Restore an existing session on mount so a refresh keeps the admin logged in.
  useEffect(() => {
    let active = true;
    authService.me().then((user) => {
      if (!active) return;
      if (user) setIsAuthenticated(true);
      setCheckingSession(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Throws AuthError on failure; AdminLogin surfaces the message.
    await authService.login(credentials.email, credentials.password);
    setIsAuthenticated(true);
    setEditMode(true); // Enable edit mode when admin logs in
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setEditMode(false); // Disable edit mode when admin logs out
  };

  const handleGoToLiveEditor = () => {
    setEditMode(true); // Enable edit mode
    navigate('/'); // Navigate to home page
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Checking session…</p>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} onGoToLiveEditor={handleGoToLiveEditor} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminPanel;
