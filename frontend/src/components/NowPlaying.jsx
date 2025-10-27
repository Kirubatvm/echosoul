import { usePlayer } from '../context/PlayerContext';

export default function NowPlaying() {
  const { current, isPlaying, toggle, progress, duration, seek, next, previous, showNowPlaying, setShowNowPlaying } = usePlayer();

  if (!showNowPlaying || !current) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="now-playing-overlay">
      <div className="now-playing-container">
        {/* Close button */}
        <button className="close-btn" onClick={() => setShowNowPlaying(false)}>
          ✕
        </button>

        {/* Album artwork */}
        <div className="artwork-container">
          {current.coverImage ? (
            <img src={current.coverImage} alt={current.title} className="artwork" />
          ) : (
            <div className="artwork-placeholder">🎵</div>
          )}
        </div>

        {/* Song info */}
        <div className="song-info">
          <h1 className="song-title">{current.title}</h1>
          <p className="song-artist">{current.artist}</p>
        </div>

        {/* Progress bar */}
        <div className="progress-section">
          <div className="seekbar-large" onClick={handleSeek}>
            <div className="seekbar-fill" style={{ width: `${progressPercentage}%` }} />
            <div className="seekbar-thumb" style={{ left: `${progressPercentage}%` }} />
          </div>
          <div className="time-labels">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button className="control-btn" onClick={previous} title="Previous">
            ⏮
          </button>
          <button className="control-btn-main" onClick={toggle}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={next} title="Next">
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
}
