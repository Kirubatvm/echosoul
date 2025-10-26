import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Upload from './pages/Upload';
import Library from './pages/Library';
import PlaylistView from './pages/PlaylistView';
import Login from './pages/Login';
import Register from './pages/Register';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <nav className="nav container">
        <div className="row" style={{gap:16}}>
          <Link to="/" className="title" style={{letterSpacing:.3}}>EchoSoul</Link>
          <Link to="/search">Search</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/library">Library</Link>
        </div>
        <div className="spacer" />
        {user ? (
          <div className="row">
            <span className="subtitle">Hi, {user.username}</span>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="row">
            <Link to="/login" className="btn secondary">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
}

function AudioBar() {
  const { current, isPlaying, toggle } = usePlayer();
  if (!current) return null;
  return (
    <div className="footerbar">
      {current.coverImage && <img className="cover" src={current.coverImage} alt="" />}
      <div style={{flex:1}}>
        <div className="title">{current.title}</div>
        <div className="subtitle">{current.artist}</div>
      </div>
      <button className="btn" onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Header />
          <div style={{paddingBottom:64}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<Protected><Upload /></Protected>} />
              <Route path="/library" element={<Protected><Library /></Protected>} />
              <Route path="/playlist/:id" element={<PlaylistView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <AudioBar />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
