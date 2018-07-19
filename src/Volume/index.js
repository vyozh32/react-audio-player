import React from 'react';

const Volume = () => {
  return (
    <div className="volume">
      <div className="volume-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#566574" fillRule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" id="speaker"/>
        </svg>
      </div>
      <div className="volume-controls">
        <div className="slider" data-direction="horizontal">
          <div className="progress">
            <div className="pin" id="volume-pin" data-method="changeVolume"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volume;