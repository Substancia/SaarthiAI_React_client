import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DisplayAudioFile, UploadAudioPage } from './Containers';

const App = () => {
  // Uploaded audio file state lifter to App.js
  const [audioFile, setAudioFile] = useState(null);

  return (
    <div className="App">
      <Routes>
        {/* Default route points to audio file upload form */}
        <Route path='/' element={
          <UploadAudioPage sendAudioFile={setAudioFile} />
        } />

        {/* Audio file upload reroutes to this route for waveform analysis */}
        <Route path='/analyzeAudio' element={
          <DisplayAudioFile audioFile={audioFile} />
        } />

      </Routes>
    </div>
  );
}

export default App;
