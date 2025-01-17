import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom } from 'react-icons/fa';
import { BiRepeat } from 'react-icons/bi';
import Slider from '@mui/material/Slider';
import AdPlayer from './AdPlayer';

function MusicPlayer({
  currentlyPlaying,
  duration,
  currentTime,
  audioRef,
  color,
  selectedFont,
  playSong,
  pauseSong,
  skipTrack,
  formatTime,
}) {
  const [volume, setVolume] = useState(() => {
    const storedVolume = localStorage.getItem('volume');
    return storedVolume !== null ? parseInt(storedVolume, 10) : 50;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [totalTimePlayed, setTotalTimePlayed] = useState(() => {
    const storedTimePlayed = localStorage.getItem('totalTimePlayed');
    return storedTimePlayed !== null ? parseInt(storedTimePlayed, 10) : 0;
  });
  const [storedCurrentTime, setStoredCurrentTime] = useState(0);
  const audioPlayerRef = useRef(null);

  const handleSongEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(true);
    }
  };

  useEffect(() => {
    fetch('/api/songs/')  // Update the endpoint based on your API
      .then((response) => response.json())
      .then((data) => {
      });

    fetch('/api/ads/list/')  // Update the endpoint based on your API
      .then((response) => response.json())
      .then((data) => {
        setAds(data);
      })
      .catch((error) => {
        console.error('Error fetching ads:', error);
      });

    audioPlayerRef.current = audioRef.current;
  }, [currentlyPlaying, audioRef]);

  useEffect(() => {
    const storedIsPlaying = localStorage.getItem('isPlaying') === 'true';
    setIsPlaying(storedIsPlaying);

    const handlePlay = () => {
      setIsPlaying(true);
      localStorage.setItem('isPlaying', 'true');
    };

    const handlePause = () => {
      setIsPlaying(false);
      localStorage.setItem('isPlaying', 'false');
    };

    audioPlayerRef.current.addEventListener('play', handlePlay);
    audioPlayerRef.current.addEventListener('pause', handlePause);

    return () => {
      audioPlayerRef.current.removeEventListener('play', handlePlay);
      audioPlayerRef.current.removeEventListener('pause', handlePause);
    };
  }, [audioRef]);

  useEffect(() => {
    audioPlayerRef.current.volume = volume / 100;
    localStorage.setItem('volume', volume.toString());
    setIsMuted(volume === 0);
  }, [volume]);

  useEffect(() => {
    const storedTime = localStorage.getItem('currentTime');
    if (storedTime) {
      setStoredCurrentTime(parseFloat(storedTime));
    }
  }, [currentTime]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setTotalTimePlayed((prevTime) => prevTime + 1);

      if (totalTimePlayed >= 420 && !audioPlayerRef.current.paused) {
        playAd();
        setTotalTimePlayed(0);
      }

      localStorage.setItem('totalTimePlayed', totalTimePlayed.toString());
      localStorage.setItem('currentTime', audioPlayerRef.current.currentTime.toString());
    };

    audioPlayerRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioPlayerRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTime, totalTimePlayed]);

  const playAd = async () => {
    const nextAdIndex = Math.floor(Math.random() * ads.length);
    const nextAd = ads[nextAdIndex];

    if (nextAd) {
      console.log('Playing Ad:', nextAd);

      try {
        await audioPlayerRef.current.pause();
        setCurrentAd(nextAd);
      } catch (error) {
        console.error('Error playing ad:', error);
      }
    } else {
      console.log('No audio ads available.');
    }
  };

  const handleAdFinish = () => {
    console.log('Ad finished. Resuming playback...');
    setCurrentAd(null);
    setTotalTimePlayed(0);
    audioPlayerRef.current.play();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong(currentlyPlaying);
    }
  };

  const toggleMute = () => {
    const newVolume = isMuted ? 50 : 0;
    setVolume(newVolume);
    audioPlayerRef.current.volume = newVolume / 100;
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    if (!isRepeat) {
      setIsRepeat(true);
      setIsShuffle(false);
    } else if (isRepeat && !isShuffle) {
      setIsRepeat(false);
    } else {
      setIsRepeat(false);
    }
  };

  const handleBackward = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(false);
    }
  };
  
  const handleForward = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipTrack(true);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleTimeBarChange = (event, newValue) => {
    // Check if the slider change is due to user interaction
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      const newTime = (newValue / 100) * duration;
      setStoredCurrentTime(newTime); // Update stored current time
      audioPlayerRef.current.currentTime = newTime; // Set audio player's current time
    }
  };

  useEffect(() => {
    audioPlayerRef.current.addEventListener('ended', handleSongEnd);

    return () => {
      audioPlayerRef.current.removeEventListener('ended', handleSongEnd);
    };
  }, [currentlyPlaying, skipTrack]);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#282828', color: '#fff', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
      {currentAd ? (
        <AdPlayer currentAd={currentAd} handleAdFinish={handleAdFinish} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderTop: '1px solid #535353' }}>          
          {currentlyPlaying && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={currentlyPlaying.picture} alt="Album Art" style={{ width: '64px', height: '64px', marginRight: '20px', borderRadius: '4px' }} />
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontFamily: selectedFont, fontSize: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentlyPlaying.name}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#b3b3b3' }}>{currentlyPlaying.artist}</p>
              </div>
            </div>
          )}
          <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
            <button onClick={toggleRepeat} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
              {isRepeat ? <BiRepeat style={{ color: '#8a63d2' }} /> : <BiRepeat style={{ color: '#fff' }} />}
            </button>
            <button onClick={handleBackward} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
              <FaStepBackward />
            </button>
            <button onClick={togglePlay} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '32px', color: '#fff' }}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleForward} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
              <FaStepForward />
            </button>
            <button onClick={toggleShuffle} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#fff' }}>
              <FaRandom style={{ color: isShuffle ? '#8a63d2' : '#fff' }} />
            </button>
          </div>
          {duration > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '3px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40%',
                cursor: 'pointer',
                margin: 'auto',
              }}
            >
              <Slider
                value={(currentTime / duration) * 100}
                onChange={handleTimeBarChange}
                aria-labelledby="continuous-slider"
                style={{ color: '#fff', width: '100%' }}
              />
              <div
                style={{
                  color: '#b3b3b3',
                  fontSize: '14px',
                  textAlign: 'left',
                  position: 'absolute',
                  left: '0',
                  top: '-20px',
                }}
              >
                {formatTime(currentTime)}
              </div>
              <div
                style={{
                  color: '#b3b3b3',
                  fontSize: '14px',
                  textAlign: 'right',
                  position: 'absolute',
                  right: '0',
                  top: '-20px',
                }}
              >
                {formatTime(duration)}
              </div>
            </div>
          )}
          <div style={{ position: 'fixed', right: '20px', bottom: '20px', display: 'flex', alignItems: 'center' }}>
          <button onClick={toggleMute} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '20px', color: '#fff' }}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
            style={{ color: '#fff', width: '100px', '& .MuiSlider-thumb': { width: 20, height: 20 } }}
          />
        </div>
      </div>
    )}
  </div>
);
}

export default MusicPlayer;
