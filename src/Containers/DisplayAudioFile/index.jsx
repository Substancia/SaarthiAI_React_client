import React from "react";
import { AudioWaveform } from '../../Components';
import './index.scss';

const DisplayAudioFile = ({ audioFile }) => {
  return (
    <div className='display-audioFile'>
      <AudioWaveform
        audioFile={audioFile}
      />
      
      {/* Container made for adding timestamp-notes feature (assignment 1)
      for if I find time */}
    </div>
  );
}

export default DisplayAudioFile;