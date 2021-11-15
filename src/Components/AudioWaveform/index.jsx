import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { AudioDurationScale, TrimSlider } from "..";
import { Preloader } from "../../Modals";
import './index.scss';

const AudioWaveform = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const [waveformWidth, setWaveformWidth] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [minZoom, setMinZoom] = useState(0);
  const [maxZoom, setMaxZoom] = useState(0);
  const [trimStartZoomOffset, setTrimStartZoomOffset] = useState(0);
  const [trimEndZoomOffset, setTrimEndZoomOffset] = useState(0);
  const waveform = useRef(null);
  const waveformContainer = useRef(null);
  const trimStartRef = useRef(trimStart);
  const userPaused = useRef(false);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformContainer.current,
      progressColor: "OrangeRed",
      cursorColor: "OrangeRed",
      autoCenter: false,
      hideScrollbar: true,
    });
    waveform.current.loadBlob(props.audioFile);
    waveform.current.on('ready', () => {
      waveform.current.setVolume(volume);
      setWaveformWidth(waveformContainer.current.clientWidth);
      let ZOOM = waveformContainer.current.clientWidth / waveform.current.getDuration();
      setZoom(ZOOM);
      setMinZoom(ZOOM);
      setMaxZoom(ZOOM);
      setIsLoading(false);
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

  useEffect(() => {
    setMaxZoom(Math.min(720, minZoom / (trimEnd - trimStart)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimStart, trimEnd]);

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

  const handleZoomChange = e => {
    let ZOOM = parseFloat(e.target.value);
    // console.log('ZOOM:', ZOOM);
    setZoom(ZOOM);
    if(playing) userPaused.current = true;
    waveform.current.pause();
    waveform.current.zoom(ZOOM);
    // waveform.current.toggleScroll();

    let totalOffset = (waveform.current.getDuration() - waveformWidth/ZOOM) / waveform.current.getDuration();
    setTrimStartZoomOffset(trimStart * totalOffset / (trimStart + 1 - trimEnd));
    setTrimEndZoomOffset((1 - trimEnd) * totalOffset / (trimStart + 1 - trimEnd));

    positionZoomWave(ZOOM);
  }

  const handleTrimChange = (widthRatio, offsetTrim, setTrim) => {
    // setTrim(offsetTrim / waveformWidth + widthRatio * waveformWidth / (zoom * waveform.current.getDuration()));
    setTrim(offsetTrim + widthRatio);
  }

  const positionZoomWave = (ZOOM) => {
    // FIND the new wave center
    // seekAndCenter
    // GO back to original seek position

    let currentPos = waveform.current.getCurrentTime();   // in seconds
    let waveCenter = waveform.current.getDuration() / 2;
    let trimCenter = waveCenter * (trimStart + trimEnd);
    let newWaveCenter = waveCenter + (trimCenter - waveCenter) * (ZOOM - minZoom) / (maxZoom - minZoom);
    console.log('newWaveCenter fraction:', Math.min(Math.max((newWaveCenter / (2 * waveCenter)), 0), 1));
    console.log('trimCenter fraction:', (trimStart + trimEnd) / 2);

    waveform.current.seekAndCenter(Math.min(Math.max((newWaveCenter / (2 * waveCenter)), 0), 1));

    waveform.current.seekTo(currentPos / (2 * waveCenter));
  }

  const waveWidth = waveform.current !== null ? zoom * waveform.current.getDuration() : 0;

  console.log(trimStart, trimEnd);

  return (
    <div className='audio-container'>
      <Preloader show={isLoading} />

      <div id='audio-waveform' ref={waveformContainer}>
        <TrimSlider
          side='left'
          trimLim={(trimEnd + trimEndZoomOffset)*waveWidth}
          setTrim={val => handleTrimChange(val/waveWidth, trimStartZoomOffset, setTrimStart)}
          width={(trimStart - trimStartZoomOffset) * waveWidth}
        />
        <TrimSlider
          side='right'
          trimLim={(1 - (trimStart - trimStartZoomOffset))*waveWidth}
          setTrim={val => handleTrimChange((1 - val/waveWidth), trimEndZoomOffset, setTrimEnd)}
          width={(1 - trimEnd - trimEndZoomOffset) * waveWidth}
        />
      </div>

      <AudioDurationScale
        audioDuration={waveform.current !== null ? waveform.current.getDuration() : null}
        waveformWidth={waveformWidth || 0}
      />

      <div className='audio-controls'>
        <div className='buttons'>
          <label className='switch'>
            <input type='checkbox' />
            <span className='slider' />
          </label>

          <button onClick={handlePlayPause} className='no-border'>
            <i class={`fas fa-${ playing ? 'pause' : 'play' }`} />
          </button>

          <button onClick={setToStart} className='no-border'>
            <i class='fas fa-undo' />
          </button>

          <button><i class='fas fa-cut' /> Trim</button>
        </div>

        <div className='scales'>
          <label htmlFor='zoom'>Zoom</label>
          <input
            name='zoom'
            type='range'
            min={minZoom.toString()}
            max={maxZoom.toString()}
            step={((maxZoom - minZoom) / 10).toString()}
            onChange={handleZoomChange}
            value={zoom.toString()}
          />

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