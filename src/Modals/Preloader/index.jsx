import React from "react";
import './index.scss';

const Preloader = ({ show }) =>
  show ?
    <div className='preloader-container'>
      <div className='modal-bg' />
      <div className='preloader' />
    </div> :
    null

export default Preloader;