import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { AudioDurationScale, TrimSlider } from "..";
import './index.scss';

const AudioWaveform = props => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const [waveformWidth, setWaveformWidth] = useState(null);
  const waveform = useRef(null);
  const waveformContainer = useRef(null);
  const trimStartRef = useRef(trimStart);
  const userPaused = useRef(false);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformContainer.current,
      progressColor: "OrangeRed",
      cursorColor: "OrangeRed",
    });
    waveform.current.loadBlob(props.audioFile);
    waveform.current.on('ready', () => {
      waveform.current.setVolume(volume);
      setWaveformWidth(waveformContainer.current.offsetWidth - 2);
    });
    waveform.current.on('finish', () => {
      waveform.current.seekTo(trimStartRef.current);
      setPlaying(false);
    });
    waveform.current.on('pause', () => {
      if(userPaused.current) {
        userPaused.current = false;
      } else {
        waveform.current.seekTo(trimStartRef.current);
      }
      setPlaying(false);
    });
    
    return () => waveform.current.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioFile]);

  useEffect(() => {
    const currentPos = waveform.current.getCurrentTime() / waveform.current.getDuration();
    if(currentPos < trimStart) {
      waveform.current.seekTo(trimStart);
    }

    trimStartRef.current = trimStart;
  }, [trimStart]);

  useEffect(() => {
    const currentPos = waveform.current.getCurrentTime() / waveform.current.getDuration();
    if(currentPos > trimEnd) {
      waveform.current.seekTo(trimEnd);
      userPaused.current = true;
      waveform.current.pause();
    }
  }, [trimEnd]);

  const handlePlayPause = () => {
    if(playing) {
      userPaused.current = true;
      waveform.current.pause();
    } else {
      waveform.current.play(waveform.current.getCurrentTime(), trimEnd * waveform.current.getDuration());
    }
    setPlaying(!playing);
  }

  const setToStart = () => {
    waveform.current.seekTo(trimStart);
    waveform.current.play(waveform.current.getCurrentTime(), trimEnd * waveform.current.getDuration());
    setPlaying(true);
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
          trimLim={trimEnd*waveformWidth}
          setTrim={val => setTrimStart(val/waveformWidth)}
        />
        <TrimSlider
          side='right'
          trimLim={(1 - trimStart)*waveformWidth}
          setTrim={val => setTrimEnd(1 - val/waveformWidth)}
        />
      </div>

      <AudioDurationScale
        audioDuration={waveform.current !== null ? waveform.current.getDuration() : null}
        waveformWidth={waveformWidth || 0}
      />

      <div className='audio-controls'>
        <button>Toggle Agent/Customer</button>

        <button onClick={handlePlayPause}>
          <i class={`fas fa-${ playing ? 'pause' : 'play' }`} />
        </button>

        <button onClick={setToStart}><i class='fas fa-undo' /></button>

        <button><i class='fas fa-cut' /> Trim</button>

        {/* <label htmlFor='scale'>Scale</label>
        <input
          name='scale'
          type='range'
          min='1'
          max='2'
          step='0.025'
          onChange={null}
          value='1'
        /> */}

        <div className='volume-control'>
          <input
            name='volume'
            type='range'
            min='0'
            max='1'
            step='0.025'
            onChange={handleVolumeChange}
            value={volume}
          />
          <label htmlFor='volume'>Volume</label>
        </div>
      </div>
    </div>
  );
}

export default AudioWaveform;