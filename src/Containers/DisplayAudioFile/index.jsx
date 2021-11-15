import React from "react";
import { AudioWaveform } from '../../Components';
import './index.scss';

const DisplayAudioFile = ({ audioFile }) => {
  return (
    <div className='display-audioFile'>
      <AudioWaveform
        audioFile={audioFile}
      />

      {/* To implement timestamp-notes in future
      -- lift trim states up till here */}
    </div>
  );
}

export default DisplayAudioFile;