import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const a = audioRef.current;
    const onTime = () => setProgress(a.currentTime);
    const onEnded = () => setIsPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('ended', onEnded); };
  }, []);

  useEffect(() => { audioRef.current.volume = volume; }, [volume]);

  const play = async (song) => {
    const a = audioRef.current;
    if (!current || current._id !== song._id) {
      setCurrent(song);
      a.src = song.audioUrl;
      a.currentTime = 0;
    }
    await a.play();
    setIsPlaying(true);
  };

  const pause = () => { audioRef.current.pause(); setIsPlaying(false); };
  const toggle = () => (isPlaying ? pause() : current ? play(current) : null);
  const seek = (sec) => { audioRef.current.currentTime = sec; };
  const setVol = (v) => setVolume(v);

  const value = useMemo(() => ({
    audioRef, current, isPlaying, progress, volume,
    play, pause, toggle, seek, setVolume: setVol
  }), [current, isPlaying, progress, volume]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
