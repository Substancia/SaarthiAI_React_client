import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { AudioDurationScale, TrimSlider } from "..";
import { Preloader } from "../../Modals";
import './index.scss';

const AudioWaveform = props => {
  // states and refs for Wavesurfer.js instance
  const [isLoading, setIsLoading] = useState(true);
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
    // initializing Wavesurfer instance
    waveform.current = WaveSurfer.create({
      container: waveformContainer.current,
      progressColor: "OrangeRed",
      cursorColor: "OrangeRed",
    });
    // loading audio file
    waveform.current.loadBlob(props.audioFile);
    // assigning event listeners
    waveform.current.on('ready', () => {
      waveform.current.setVolume(volume);
      setWaveformWidth(waveformContainer.current.clientWidth);
      setIsLoading(false);
    });
    waveform.current.on('finish', () => {
      waveform.current.seekTo(trimStartRef.current);
      setPlaying(false);
    });
    waveform.current.on('pause', () => {
      if(userPaused.current) {    // if not paused by user, send cursor to start
        userPaused.current = false;
      } else {
        waveform.current.seekTo(trimStartRef.current);
      }
      setPlaying(false);
      props.setCurrentTime(waveform.current.getCurrentTime());    // for notes
    });
    waveform.current.on('seek', () => {
      userPaused.current = true;
      waveform.current.pause();
      setPlaying(false);
      props.setCurrentTime(waveform.current.getCurrentTime());    // for notes
    });

    // component destructor
    return () => waveform.current.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioFile]);

  // to bring the cursor to after the left trim
  useEffect(() => {
    const currentPos = waveform.current.getCurrentTime() / waveform.current.getDuration();
    if(currentPos < trimStart) {
      waveform.current.seekTo(trimStart);
    }

    trimStartRef.current = trimStart;
  }, [trimStart]);

  // to bring the cursor to before the right trim
  useEffect(() => {
    const currentPos = waveform.current.getCurrentTime() / waveform.current.getDuration();
    if(currentPos > trimEnd) {
      waveform.current.seekTo(trimEnd);
      userPaused.current = true;
      waveform.current.pause();
    }
  }, [trimEnd]);


  // play/pause button
  const handlePlayPause = () => {
    if(playing) {
      userPaused.current = true;
      waveform.current.pause();
    } else {
      waveform.current.play(waveform.current.getCurrentTime(), trimEnd * waveform.current.getDuration());
    }
    setPlaying(!playing);
  }

  // restart button
  const setToStart = () => {
    waveform.current.seekTo(trimStart);
    waveform.current.play(waveform.current.getCurrentTime(), trimEnd * waveform.current.getDuration());
    setPlaying(true);
  }

  // volume slider
  const handleVolumeChange = e => {
    setVolume(e.target.value);
    waveform.current.setVolume(e.target.value || 1);
  }


  return (
    <div className='audio-container'>
      {/* Preloader */}
      <Preloader show={isLoading} />

      {/* Waveform made by wavesurfer.js instance attached to below div */}
      <div id='audio-waveform' ref={waveformContainer}>

        {/* left and right trims, hand-written because no built-in trims in the library */}
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

      {/* Audio time scale at bottom of waveform */}
      <AudioDurationScale
        audioDuration={waveform.current !== null ? waveform.current.getDuration() : null}
        waveformWidth={waveformWidth || 0}
      />

      <div className='audio-controls'>
        <div className='buttons'>
          {/* Agent/Customer switch, not hooked because not specified */}
          <label className='switch'>
            <input type='checkbox' />
            <span className='slider' />
          </label>

          {/* play/pause button */}
          <button onClick={handlePlayPause} className='no-border'>
            <i class={`fas fa-${ playing ? 'pause' : 'play' }`} />
          </button>

          {/* restart button */}
          <button onClick={setToStart} className='no-border'>
            <i class='fas fa-undo' />
          </button>

          {/* Trim button, not hooked because trimmed file not being sent anywhere */}
          <button><i class='fas fa-cut' /> Trim</button>
        </div>

        <div className='scales'>
          {/* Zoom functionality causing mismatched trimming with the
          hand-written trim functionality hence not included here
          (implemented in separate branch 'zoom-scale' on Git) */}

          {/* Volume slider */}
          <div className='volume-control'>
            <label htmlFor='volume'><i class="fas fa-volume-up" /></label>
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
      </div>
    </div>
  );
}

export default AudioWaveform;