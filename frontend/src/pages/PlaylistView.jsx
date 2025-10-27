import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';

export default function PlaylistView() {
  const { id } = useParams();
  const [pl, setPl] = useState(null);
  const { play } = usePlayer();

  useEffect(() => {
    api.get(`/api/playlists/${id}`).then(r => setPl(r.data)).catch(console.error);
  }, [id]);

  if (!pl) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{pl.name}</h2>
      {(pl.songs || []).length === 0 ? (
        <div className="empty">
          <h3>No songs in this playlist</h3>
        </div>
      ) : (
        <div className="grid cols-2">
          {(pl.songs || []).map(s => (
            <div key={s._id} className="card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ flex: 1 }}>
                  {s.coverImage ? (
                    <img className="cover" src={s.coverImage} alt="" />
                  ) : (
                    <div className="cover" />
                  )}
                  <div>
                    <div className="title">{s.title}</div>
                    <div className="subtitle">{s.artist}</div>
                  </div>
                </div>
                <button className="btn" onClick={() => play(s, pl.songs || [])}>
                  ▶ Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
