import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    api.get('/api/playlists/user').then(r => setPlaylists(r.data || [])).catch(console.error);
  }, []);

  return (
    <div style={{padding:16}}>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map(p => (
          <li key={p._id}>
            <Link to={`/playlist/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
