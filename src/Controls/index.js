import React from 'react';

const Controls = () => {
  return (
    <div className="controls">
      <span className="current-time">0:00</span>
      <div className="slider" data-direction="horizontal">
        <div className="progress">
          <div className="pin" id="progress-pin" data-method="rewind"></div>
        </div>
      </div>
      <span className="total-time">0:00</span>
    </div>
  );
};

export default Controls;