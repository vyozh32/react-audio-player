import React, { Component } from 'react';

class Controls extends Component {
  constructor(props) {
    super(props)
    this.slider = React.createRef();
  }

  state = {
    isPressed: false,
    duration: "0:00",
    totalDuration: "0:00",
    canvasWidth: 100
  }

  componentDidMount() {
    const player = document.getElementById('audio')
    player.addEventListener('canplay', this.canPlay, false)
    player.addEventListener('timeupdate', this.upadateProgress)
    window.addEventListener('mousemove', (event) => {this.state.isPressed && this.rewind(event)})
    window.addEventListener('mouseup', () => {this.mouseUp()})
  }
  
  canPlay = () => {
    const player = document.getElementById('audio')
    this.setState({
      totalDuration: this.formatTime(player.duration)
    })
  }

  upadateProgress = () => {
    const player = document.getElementById('audio')
    var current = player.currentTime;
    var percent = (current / player.duration) * 100;
    this.progress.style.width = percent + '%';

    this.setState({
      duration: this.formatTime(current)
    });
  }

  formatTime = (time) => {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
  }

  mouseDown = () => {
    this.setState({
      isPressed: true,
      volume: 1
    })
  }

  mouseUp = () => {
    this.setState({
      isPressed: false
    })
  }

  rewind = (event) => {
    const player = document.getElementById('audio')
    this.upadateProgress(event)
    if (this.inRange(event)) {
      player.currentTime = player.duration * this.getCoefficient(event);
    }
  }

  getCoefficient = (event) => {
    var slider = this.slider;
    var rect = slider.getBoundingClientRect();
    var K = 0;
    if (true) {
      var offsetX = event.clientX - rect.left;
      var width = slider.clientWidth;
      K = offsetX / width;
      if(offsetX / width > 1) {
        K = 1
      }
      else {
        K = offsetX / width;
      }
    }
    return K;
  }

  inRange = (event) => {
    var rangeBox = this.slider;
    var rect = rangeBox.getBoundingClientRect();
    if (true) {
      var min = rect.left;
      var max = min + rect.right;
      if (event.clientX < min || event.clientX > max) return false;
    } 
    return true;
  }

   getRangeBox = (event) => {
    var rangeBox = event.target;
    var el = rangeBox;
    if (event.type == 'click') {
      rangeBox = event.target.parentElement.parentElement;
    }
    if (event.type == 'mousemove') {
      rangeBox = el.parentElement.parentElement;
    }
    return rangeBox;
  }

  render() {
    const {width} = this.props
    return (
      <div onClick={this.show} className="controls">
        <span className="current-time">{this.state.duration}</span>
        <div onClick={this.rewind} ref={(element => this.slider = element)} className="slider propgress-slider" id="progress-slider" data-direction="horizontal">
          <canvas width={`${width}`} height={`${55}`} id='showcase'></canvas>
          <div ref={element => this.progress = element} className="progress">
            <div onMouseDown={this.mouseDown} className="pin" id="progress-pin" data-method="rewind"></div>
          </div>
        </div>
        <span className="total-time">{this.state.totalDuration}</span>
      </div>
    );
  }
}

export default Controls;
