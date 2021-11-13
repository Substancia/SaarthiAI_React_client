import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { TrimSlider } from "..";
import './index.scss';

const AudioWaveform = props => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const waveform = useRef(null);
  const waveformContainer = useRef(null);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformContainer.current,
      progressColor: "OrangeRed",
      cursorColor: "OrangeRed",
    });
    waveform.current.loadBlob(props.audioFile);
    waveform.current.on('ready', () => {
      waveform.current.setVolume(volume);
    });

    return () => waveform.current.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioFile]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    waveform.current.playPause();
  }

  const setToStart = () => {
    waveform.current.seekTo(props.trimStart);
  }

  const handleVolumeChange = e => {
    setVolume(e.target.value);
    waveform.current.setVolume(e.target.value || 1);
  }

  return (
    <div className='audio-container'>
      <div id='audio-waveform' ref={waveformContainer}>
        <TrimSlider
          side='left'
          setTrim={val => setTrimStart(val/waveformContainer.current.offsetWidth)}
        />
        <TrimSlider
          side='right'
          setTrim={val => setTrimEnd(1 - val/waveformContainer.current.offsetWidth)}
        />
      </div>

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
          onChange={null}
          value='1'
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