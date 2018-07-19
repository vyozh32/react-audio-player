import React from 'react';

const PlayButton = () => {
  return (
    <div className="play-pause-btn">  
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
        <path fill="#566574" fillRule="evenodd" d="M18 12L0 24V0" className="play-pause-icon" id="playPause"/>
      </svg>
    </div>
  );
}

export default PlayButton;
