import { useEffect, useState } from 'react';
import { listCVs } from '../api/gateway';
import { Link } from 'react-router-dom';

function CVList() {
  const [cvs, setCvs] = useState<any[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    listCVs(token).then(setCvs);
  }, []);

  return (
    <div>
      <h2>Your CVs</h2>
      <Link to="/cv/new">Create New CV</Link>
      <ul>
        {cvs.map((cv) => (
          <li key={cv.id}>
            <Link to={`/cv/${cv.id}`}>{cv.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CVList;
