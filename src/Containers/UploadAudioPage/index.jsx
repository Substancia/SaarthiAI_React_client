import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './index.scss';

const UploadAudioPage = ({ sendAudioFile }) => {
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();

  const uploadFile = () => {
    sendAudioFile(audioFile);
    navigate('/analyzeAudio');
  }

  return (
    <div className='file-upload-form-page'>
      <div className='file-upload-form'>
        <input type='file' accept='audio/*' onChange={e => setAudioFile(e.target.files[0])} />
        <button onClick={uploadFile} disabled={audioFile === null}>Upload</button>
      </div>
    </div>
  );
}

export default UploadAudioPage;