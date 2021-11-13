import React, { useState } from "react";
import { AudioWaveform } from '../../Components';

const DisplayAudioFile = ({ audioFile }) => {
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);

  return (
    <div>
      <AudioWaveform
        audioFile={audioFile}
        trimStart={trimStart}
        trimEnd={trimEnd}
        setTrimStart={setTrimStart}
        setTrimEnd={setTrimEnd}
      />
    </div>
  );
}

export default DisplayAudioFile;