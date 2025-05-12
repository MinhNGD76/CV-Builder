import { useState } from 'react';
import { createCV } from '../api/gateway';
import { useNavigate } from 'react-router-dom';

function CVCreate() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const handleCreate = async () => {
    const res = await createCV({ title }, token);
    if (res && res.cvId) {
      navigate(`/cv/${res.cvId}`);
    }
  };

  return (
    <div>
      <h2>Create New CV</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CV Title" />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CVCreate;
