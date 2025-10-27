import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    const onTime = () => setProgress(a.currentTime);
    const onDuration = () => setDuration(a.duration);
    const onEnded = () => {
      setIsPlaying(false);
      next(); // Auto-play next song
    };

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onDuration);
    a.addEventListener('durationchange', onDuration);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onDuration);
      a.removeEventListener('durationchange', onDuration);
      a.removeEventListener('ended', onEnded);
    };
  }, [queue, current]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const play = async (song, newQueue = []) => {
    const a = audioRef.current;
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }
    if (!current || current._id !== song._id) {
      setCurrent(song);
      a.src = song.audioUrl;
      a.currentTime = 0;
    }
    await a.play();
    setIsPlaying(true);
    setShowNowPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const toggle = () => (isPlaying ? pause() : current ? play(current) : null);

  const seek = (sec) => {
    audioRef.current.currentTime = sec;
    setProgress(sec);
  };

  const next = () => {
    if (!current || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s._id === current._id);
    const nextIndex = (currentIndex + 1) % queue.length;
    play(queue[nextIndex], queue);
  };

  const previous = () => {
    if (!current || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s._id === current._id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    play(queue[prevIndex], queue);
  };

  const setVol = (v) => setVolume(v);

  const value = useMemo(
    () => ({
      audioRef,
      current,
      queue,
      isPlaying,
      progress,
      duration,
      volume,
      showNowPlaying,
      setShowNowPlaying,
      play,
      pause,
      toggle,
      seek,
      next,
      previous,
      setVolume: setVol
    }),
    [current, queue, isPlaying, progress, duration, volume, showNowPlaying]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
