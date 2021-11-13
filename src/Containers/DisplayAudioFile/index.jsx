import React, { useEffect, useState } from "react";
import { AudioWaveform } from '../../Components';

const DisplayAudioFile = ({ audioFile }) => {
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);

  return (
    <div>
      <AudioWaveform audioFile={audioFile} />
    </div>
  );
}

export default DisplayAudioFile;