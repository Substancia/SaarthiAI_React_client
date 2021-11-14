import React from "react";
import { AudioWaveform } from '../../Components';
import './index.scss';

const DisplayAudioFile = ({ audioFile }) => {
  return (
    <div className='display-audioFile'>
      <AudioWaveform
        audioFile={audioFile}
      />
    </div>
  );
}

export default DisplayAudioFile;