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

  if (!pl) return <div style={{padding:16}}>Loading...</div>;

  return (
    <div style={{padding:16}}>
      <h2>{pl.name}</h2>
      {(pl.songs || []).map(s => (
        <div key={s._id} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
          <span>{s.title} — {s.artist}</span>
          <button onClick={() => play(s)}>Play</button>
        </div>
      ))}
    </div>
  );
}
