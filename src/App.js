import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DisplayAudioFile, UploadAudioPage } from './Containers';

const App = () => {
  const [audioFile, setAudioFile] = useState(null);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={
          <UploadAudioPage sendAudioFile={setAudioFile} />
        } />

        <Route path='/analyzeAudio' element={
          <DisplayAudioFile audioFile={audioFile} />
        } />

        <Route path='/test' element={<p>test</p>} />
        
        {/* <Redirect to='/' /> */}
      </Routes>
    </div>
  );
}

export default App;
