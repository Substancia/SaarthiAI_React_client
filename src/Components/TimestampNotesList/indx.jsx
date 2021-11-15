import React from "react";
import './index.scss';

const TimestampNotesList = props => {
  const deleteNote = index => {
    props.setNotes(props.notes.slice(0, index)
      .concat(props.notes.slice(index + 1))
    );
  }

  const listNotes = props.notes.map((note, index) =>
    <div className='note' key={index}>
      <button className='delete' onClick={() => deleteNote(index)}>
        <i class="fas fa-times" />
      </button>
      <p>Timestamp: {note.timestamp}s</p>
      <p>Note: {note.note}</p>
    </div>
  );

  return (
    <div className='list-notes'>
      <h4>Notes</h4>
      {listNotes}
    </div>
  );
}

export default TimestampNotesList;