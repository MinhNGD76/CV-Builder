import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://localhost:3000/health') // Update this path if needed
      .then((res) => res.json())
      .then((data: { message?: string }) => {
        setMessage(data.message || 'Success');
      })
      .catch(() => {
        setMessage('Failed to connect');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Microservices Frontend</h1>
      <p>Gateway status: {message}</p>
    </div>
  );
}

export default App;
