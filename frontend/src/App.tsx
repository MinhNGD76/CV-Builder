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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="cv" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CVList />
            </ProtectedRoute>
          } />
          
          <Route path="cv/new" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CVCreate />
            </ProtectedRoute>
          } />
          
          <Route path="cv/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
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
