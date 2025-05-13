import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }
        
        // Validate token without using the verifyToken endpoint
        // Just check if it exists and has the correct format
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }
        
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [location.pathname]); // Re-check when route changes
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">CV Builder</Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              
              {isLoading ? (
                <div className="animate-pulse w-16 h-4 bg-gray-200 rounded"></div>
              ) : isLoggedIn ? (
                <>
                  <Link to="/cv" className="text-gray-700 hover:text-blue-600">My CVs</Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                  <Link to="/register" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© {new Date().getFullYear()} CV Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
