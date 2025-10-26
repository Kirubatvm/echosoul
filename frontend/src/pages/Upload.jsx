import { useState } from 'react';
import api from '../api/axios';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('artist', artist);
    if (audio) fd.append('audio', audio);
    if (cover) fd.append('cover', cover);
    try {
      await api.post('/api/songs/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Uploaded');
      setTitle(''); setArtist(''); setAudio(null); setCover(null);
    } catch (e) { setMsg('Upload failed'); }
  };

  return (
    <div className="container">
      <h2>Upload song</h2>
      <form onSubmit={submit} className="grid cols-2">
        <div className="card grid">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="Artist" value={artist} onChange={e=>setArtist(e.target.value)} />
          <input className="file" type="file" accept="audio/*" onChange={e=>setAudio(e.target.files[0])} />
          <input className="file" type="file" accept="image/*" onChange={e=>setCover(e.target.files[0])} />
          <button className="btn" type="submit">Upload</button>
          {msg && <div className="subtitle">{msg}</div>}
        </div>
        <div className="card">
          <div className="subtitle">Tip: MP3 or AAC recommended. Cover around 512×512.</div>
          <hr />
          <div className="subtitle">Files are uploaded through your backend to Cloudinary and streamed from their CDN.</div>
        </div>
      </form>
    </div>
  );
}
