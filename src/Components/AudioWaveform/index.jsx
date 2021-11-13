import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWaveform = ({ audioFile }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const waveform = useRef(null);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: '#audio-waveform',
      progressColor: "OrangeRed",
      cursorColor: "OrangeRed",
    });
    waveform.current.loadBlob(audioFile);
    waveform.current.on('ready', () => {
      waveform.current.setVolume(volume);
    });

    return () => waveform.current.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    waveform.current.playPause();
  }

  const setToStart = () => {
    waveform.current.seekTo(0);
  }

  const handleVolumeChange = e => {
    setVolume(e.target.value);
    waveform.current.setVolume(e.target.value || 1);
  }

  return (
    <div>
      <div id='audio-waveform' />

      <div className='audio-controls'>
        <button>Toggle Agent/Customer</button>

        <button onClick={handlePlayPause}>
          { playing ? 'Pause' : 'Play' }
        </button>

        <button onClick={setToStart}>Restart</button>

        <button>Trim</button>

        <label htmlFor='scale'>Scale</label>
        <input
          name='scale'
          type='range'
          min='1'
          max='2'
          step='0.025'
        />

        <label htmlFor='volume'>Volume</label>
        <input
          name='volume'
          type='range'
          min='0'
          max='1'
          step='0.025'
          onChange={handleVolumeChange}
          value={volume}
        />
      </div>
    </div>
  );
}

export default AudioWaveform;