// component for creating notes at different timestamps

import React, { useState } from "react";
import './index.scss';

const TimestampNotesAdd = props => {
  const [note, setNote] = useState('');

  // adding notes to the collection and sorting with timestamps
  const addNote = () => {
    props.setNotes(prevNotes => {
      let allNotes = prevNotes.concat([{
        timestamp: props.currentTime,
        note: note
      }]);
      allNotes.sort((a, b) => a.timestamp - b.timestamp);
      return allNotes;
    });

    setNote('');
  }

  return (
    <div className='new-note'>
      <p>Timestamp: {props.currentTime}s</p>

      <label htmlFor='note'>Enter note:</label>
      <textarea name='note' value={note} onChange={e => setNote(e.target.value)} />

      <button onClick={addNote}>Add note</button>
    </div>
  );
}

export default TimestampNotesAdd;