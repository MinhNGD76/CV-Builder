import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CVCreate from './pages/CVCreate';
import CVList from './pages/CVList';
import CVDetail from './pages/CVDetail';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import { verifyToken } from './api/gateway';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        const isValid = await verifyToken(token);
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isAuthLoading}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="cv" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isAuthLoading}>
              <CVList />
            </ProtectedRoute>
          } />
          
          <Route path="cv/new" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isAuthLoading}>
              <CVCreate />
            </ProtectedRoute>
          } />
          
          <Route path="cv/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isAuthLoading}>
              <CVDetail />
            </ProtectedRoute>
          } />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
