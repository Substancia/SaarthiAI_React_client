import React, { useState } from "react";
import { AudioWaveform, TimestampNotesAdd, TimestampNotesList } from '../../Components';
import './index.scss';

const DisplayAudioFile = ({ audioFile }) => {
  // states for notes keeping
  const [notes, setNotes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  // processing timestamps into ms precision
  const processTimestamp = timestamp =>
    setCurrentTime(Math.round(timestamp * 1000) / 1000);

  return (
    <div className='display-audioFile'>
      <AudioWaveform
        audioFile={audioFile}
        setCurrentTime={processTimestamp}
      />
      
      {/* Container made for adding timestamp-notes feature (assignment 1)
      for future implementations */}
      <div className='timestamp-notes'>
        <TimestampNotesAdd setNotes={setNotes} currentTime={currentTime} />
        <TimestampNotesList notes={notes} setNotes={setNotes} />
      </div>
    </div>
  );
}

export default DisplayAudioFile;