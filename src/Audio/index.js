import React, { Component } from 'react';
import PlayButton from "../PlayButton";
import Controls from '../Controls'
import Volume from '../Volume'

class Audio extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log(this.player)
  }
  

  render() {
    const {visible, height, width, height2} = this.props
    return (
      <div className="audio green-audio-player">
          <canvas width={`${width}`} height={`${height}`} id='showcase'></canvas>
          <canvas width={`${width}`} height={`${height2}`} id='showcase2'></canvas>
            <div style={visible ? {display: "block"} : {display: "none"}} className="loading">
              <div className="spinner"></div>
            </div>
            <PlayButton/>
            <Controls/>
            <Volume/>
            <audio ref={(element) => this.player = element} crossOrigin="true" loop>
              <source src="../muse.mp3" type="audio/mpeg"/>
            </audio>
        </div>
    );
  };
}

export default Audio;