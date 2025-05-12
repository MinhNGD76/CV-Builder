import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CVCreate from './pages/CVCreate';
import CVList from './pages/CVList';
import CVDetail from './pages/CVDetail';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
        <Link to="/profile">Profile</Link> | <Link to="/cv">CVs</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to CV Builder</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cv" element={<CVList />} />
        <Route path="/cv/new" element={<CVCreate />} />
        <Route path="/cv/:id" element={<CVDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
