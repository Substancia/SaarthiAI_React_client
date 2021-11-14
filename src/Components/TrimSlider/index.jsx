import React, { useRef } from "react";
import './index.scss';

const TrimSlider = props => {
  const slider = useRef(null);

  const dragCursor = () => {
    const e = window.event;
    const clickedPos = e.clientX;
    const offsetWidth = slider.current.offsetWidth;

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      props.setTrim(slider.current.offsetWidth);
    }

    document.onmousemove = () => {
      const e = window.event;
      let widthChange = e.clientX - clickedPos;
      if(props.side === 'right')
        widthChange *= -1;
      slider.current.style.width = Math.min((offsetWidth + widthChange), props.trimLim) + 'px';
    }
  }

  return (
    <div className={`trim-slider trim-slider-${props.side}`} ref={slider}>
      <div className='trim-slider-bg' />
      <div
        className={`trim-slider-cursor trim-slider-cursor-${props.side}`}
        onMouseDown={dragCursor}
      />
    </div>
  );
}

export default TrimSlider;