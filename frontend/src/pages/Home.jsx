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
      <h2>Songs</h2>
      {songs.length === 0 ? (
        <p className="subtitle">No songs yet. Try uploading one.</p>
      ) : (
        <div className="grid cols-3">
          {songs.map(s => (
            <div key={s._id} className="card row" style={{justifyContent:'space-between'}}>
              <div className="row" style={{flex:1}}>
                {s.coverImage && <img className="cover" src={s.coverImage} alt="" />}
                <div>
                  <div className="title">{s.title}</div>
                  <div className="subtitle">{s.artist}</div>
                </div>
              </div>
              <button className="btn" onClick={() => play(s)}>Play</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
