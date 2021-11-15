// Simple axis time scale for waveform, made with SVGs

import React, { useEffect, useState } from "react";
import './index.scss';

const AudioDurationScale = ({ audioDuration, waveformWidth }) => {
  // lease count
  const [chunkSize, setChunkSize] = useState(10);

  // setting least count of axis
  useEffect(() => {
    if(audioDuration > 0) {
      let roughSize = audioDuration / 8;
      setChunkSize(Math.max((Math.round(roughSize / 5)) * 5, 1));
    }
  }, [audioDuration]);

  // time markers for the axis, written in minutes (seconds version commented)
  const axisMarkers = [...Array(parseInt(audioDuration / chunkSize) + 1).keys()]
    .map(n =>
      <text
        key={n}
        x={((n * chunkSize / audioDuration) * waveformWidth).toString()}
        y='15'
        fill='black'
        fontSize='14'
      >
        {/* {(n * chunkSize).toString() + 's'} */}
        {`${Math.floor(n * chunkSize / 60)}:${('0' + (n * chunkSize) % 60).slice(-2)}`}
      </text>
    );

  return (
    <div className='audioDurationScale'>
      <svg height='20' width={waveformWidth.toString()}>
        {axisMarkers}
        Sorry, your browser does not support inline SVG.
      </svg>
    </div>
  );
}

export default AudioDurationScale;