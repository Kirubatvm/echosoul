import { useEffect, useState } from 'react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const { play } = usePlayer();

  useEffect(() => {
    api.get('/api/songs').then(r => setSongs(r.data || [])).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>Discover</h2>
      {songs.length === 0 ? (
        <div className="empty">
          <h3>No songs yet</h3>
          <p className="subtitle">Upload your first track to get started</p>
        </div>
      ) : (
        <div className="grid cols-3">
          {songs.map(s => (
            <div key={s._id} className="card">
              <div className="row" style={{ marginBottom: 12 }}>
                {s.coverImage ? (
                  <img className="cover" src={s.coverImage} alt="" />
                ) : (
                  <div className="cover" />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="title">{s.title}</div>
                  <div className="subtitle">{s.artist}</div>
                </div>
              </div>
              <button className="btn" onClick={() => play(s)} style={{ width: '100%' }}>
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
