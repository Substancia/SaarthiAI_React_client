// reusable trim component, used for both left and right trim with props.side

import React, { useRef } from "react";
import './index.scss';

const TrimSlider = props => {
  // using ref to make draggable borders
  const slider = useRef(null);

  // subscribing mouse movements to drag movements
  const dragCursor = () => {
    const e = window.event;
    const clickedPos = e.clientX;
    const offsetWidth = slider.current.offsetWidth;

    // click release unsubscribes mouse from the dragging
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      // sending resized division width as "trim" width. wave portion behind trim div is inaccessible.
      props.setTrim(slider.current.offsetWidth);
    }

    // tracking mouse movement for dragging borders
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