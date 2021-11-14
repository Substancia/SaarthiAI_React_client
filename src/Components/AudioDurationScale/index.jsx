import React, { useEffect, useState } from "react";
import './index.scss';

const AudioDurationScale = ({ audioDuration, waveformWidth }) => {
  const [chunkSize, setChunkSize] = useState(10);

  useEffect(() => {
    if(audioDuration > 0) {
      let roughSize = audioDuration / 8;
      setChunkSize(Math.max((Math.round(roughSize / 5)) * 5, 1));
    }
  }, [audioDuration]);

  const axisMarkers = [...Array(parseInt(audioDuration / chunkSize) + 1).keys()]
    // .filter(n => n % 5 === 0)
    .map(n =>
      // <line x1={(((n * chunkSize / audioDuration) * waveformWidth)).toString()} y1='0' x2={(((n * chunkSize / audioDuration) * waveformWidth)).toString()} y2='10' />
      <text
        key={n}
        x={((n * chunkSize / audioDuration) * waveformWidth).toString()}
        y='15'
        fill='black'
        fontSize='14'
      >
        {(n * chunkSize).toString() + 's'}
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