import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    api.get('/api/playlists/user').then(r => setPlaylists(r.data || [])).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Your Playlists</h2>
      {playlists.length === 0 ? (
        <div className="empty">
          <h3>No playlists yet</h3>
          <p className="subtitle">Create your first playlist</p>
        </div>
      ) : (
        <div className="grid cols-2">
          {playlists.map(p => (
            <Link key={p._id} to={`/playlist/${p._id}`}>
              <div className="card">
                <div className="title">{p.name}</div>
                <div className="subtitle">{p.songs?.length || 0} songs</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
