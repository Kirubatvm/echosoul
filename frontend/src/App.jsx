import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Upload from './pages/Upload';
import Library from './pages/Library';
import PlaylistView from './pages/PlaylistView';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/upload" element={<Protected><Upload /></Protected>} />
              <Route path="/library" element={<Protected><Library /></Protected>} />
              <Route path="/playlist/:id" element={<PlaylistView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <AudioPlayer />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
