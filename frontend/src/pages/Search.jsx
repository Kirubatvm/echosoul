import { useEffect, useState } from 'react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';

export default function Search() {
  const [q, setQ] = useState('');
  const [songs, setSongs] = useState([]);
  const { play } = usePlayer();

  useEffect(() => {
    const t = setTimeout(() => {
      const url = q ? `/api/songs/search?query=${encodeURIComponent(q)}` : '/api/songs';
      api.get(url).then(r => setSongs(r.data || [])).catch(console.error);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="container">
      <h2>Search</h2>
      <input
        className="input"
        placeholder="Search songs or artists..."
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <div className="section grid cols-2">
        {songs.map(s => (
          <div key={s._id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="row" style={{ flex: 1, minWidth: 0 }}>
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
              <button className="btn" onClick={() => play(s, songs)}>
                ▶ Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
