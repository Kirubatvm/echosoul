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
      await api.post('/api/songs/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Uploaded successfully!');
      setTitle('');
      setArtist('');
      setAudio(null);
      setCover(null);
    } catch (e) {
      setMsg('Upload failed');
    }
  };

  return (
    <div className="container">
      <h2>Upload Song</h2>
      <div className="grid cols-2">
        <div className="card">
          <form onSubmit={submit}>
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              className="input"
              placeholder="Artist"
              value={artist}
              onChange={e => setArtist(e.target.value)}
            />
            <input
              className="file"
              type="file"
              accept="audio/*"
              onChange={e => setAudio(e.target.files[0])}
            />
            <input
              className="file"
              type="file"
              accept="image/*"
              onChange={e => setCover(e.target.files[0])}
            />
            <button className="btn" type="submit" style={{ width: '100%', marginTop: 8 }}>
              Upload
            </button>
            {msg && (
              <div className={msg.includes('success') ? 'success' : 'error'} style={{ marginTop: 12 }}>
                {msg}
              </div>
            )}
          </form>
        </div>
        <div className="card">
          <div className="subtitle">
            <strong>Tips:</strong>
            <br />• MP3 or AAC recommended for audio
            <br />• Cover image around 512×512px
            <br />• Files uploaded to Cloudinary via your backend
          </div>
        </div>
      </div>
    </div>
  );
}
