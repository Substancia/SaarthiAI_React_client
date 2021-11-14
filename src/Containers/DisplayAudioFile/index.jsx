import React from "react";
import { AudioWaveform } from '../../Components';

const DisplayAudioFile = ({ audioFile }) => {
  return (
    <div>
      <AudioWaveform
        audioFile={audioFile}
      />
    </div>
  );
}

export default DisplayAudioFile;