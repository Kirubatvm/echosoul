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
import { useLocation } from 'react-router-dom';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <nav className="nav">
        <div className="brand">EchoSoul</div>
        <Link
          to="/"
          style={{
            background: isActive('/') ? 'var(--brand)' : 'transparent',
            color: isActive('/') ? '#fff' : 'var(--text)'
          }}
        >
          Home
        </Link>
        <Link
          to="/search"
          style={{
            background: isActive('/search') ? 'var(--brand)' : 'transparent',
            color: isActive('/search') ? '#fff' : 'var(--text)'
          }}
        >
          Search
        </Link>
        <Link
          to="/upload"
          style={{
            background: isActive('/upload') ? 'var(--brand)' : 'transparent',
            color: isActive('/upload') ? '#fff' : 'var(--text)'
          }}
        >
          Upload
        </Link>
        <Link
          to="/library"
          style={{
            background: isActive('/library') ? 'var(--brand)' : 'transparent',
            color: isActive('/library') ? '#fff' : 'var(--text)'
          }}
        >
          Library
        </Link>
        <div className="spacer" />
        {user ? (
          <div className="row">
            <span className="subtitle">Hi, {user.username}</span>
            <button className="btn secondary" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="row">
            <Link to="/login" className="btn secondary">
              Login
            </Link>
            <Link to="/register" className="btn">
              Register
            </Link>
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
      <div style={{ flex: 1 }}>
        <div className="title">{current.title}</div>
        <div className="subtitle">{current.artist}</div>
      </div>
      <button className="btn" onClick={toggle}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Header />
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
          <AudioBar />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
