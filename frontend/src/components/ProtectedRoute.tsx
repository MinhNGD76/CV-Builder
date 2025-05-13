import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  children: ReactNode;
}

const ProtectedRoute = ({ 
  isAuthenticated, 
  isLoading = false, 
  children 
}: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verifying authentication...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location they were
    // trying to go to so we can send them there after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
