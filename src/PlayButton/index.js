import React from 'react';

const PlayButton = (props) => {
  const {playPause, isPlayed} = props
  return (
    <div onClick={playPause} className="play-pause-btn">  
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
        <path fill="#566574" fillRule="evenodd" d={isPlayed ? "M0 0h6v24H0zM12 0h6v24h-6z" : "M18 12L0 24V0"} className="play-pause-icon" id="playPause"/>
      </svg>
    </div>
  );
}

export default PlayButton;
