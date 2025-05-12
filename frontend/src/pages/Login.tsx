// import { useState } from 'react';
// import { login } from '../api/gateway';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [token, setToken] = useState('');

  // const handleLogin = async () => {
  //   const res = await login({ email, password });
  //   if (res.token) {
  //     setToken(res.token);
  //     localStorage.setItem('token', res.token);
  //     alert('Login success!');
  //   } else {
  //     alert('Login failed.');
  //   }
  // };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input placeholder="password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//       <p>Token: {token}</p>
//     </div>
//   );
// }

// export default Login;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/gateway';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setToken] = useState('');
  const [errorMessage,] = useState('');

  const handleLogin = async () => {
    const res = await login({ email, password });
    if (res.token) {
      setToken(res.token);
      localStorage.setItem('token', res.token);
      alert('Login success!');
    } else {
      alert('Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">
            <p>{errorMessage}</p>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
