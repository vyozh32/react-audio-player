import React, { Component } from 'react';

class Volume extends Component {
  constructor(props) {
    super(props)
    this.player = document.getElementById('audio')
  }

  state={
    isPressed: false,
    player: null,
    volume: 1
  }

  componentDidMount() {
      const player = document.getElementById('audio');
      this.progress.style.width = `${player.volume*100}%`;
      window.addEventListener('mousemove', (event) => {this.state.isPressed && this.changeVolume(event)})
      window.addEventListener('mouseup', () => {this.mouseUp()})
  }
  
  mouseDown = () => {
    console.log("Down")
    this.setState({
      isPressed: true,
      volume: 1
    })
  }

  mouseUp = () => {
    console.log("Up")
    this.setState({
      isPressed: false
    })
  }

  switchVolume = (event) => {
    const player = document.getElementById('audio')    
    this.setState({
      volume: !this.state.volume ? 1 : 0
    }, 
    () => {
      player.volume = this.state.volume;
      this.progress.style.width = `${this.state.volume*100}%`;
      if(this.state.volume > 0) {
        this.speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
      }
      else {
        this.speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
      }
    }
    )
  }

  updateVolume = (event) => {
    const player = document.getElementById('audio')
    this.progress.style.width = `${this.getCoefficient(event) * 100}%`        
    if (player.volume >= 0.5) {
      this.speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
    } else if (player.volume < 0.5 && player.volume > 0.05) {
      this.speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
    } else if (player.volume <= 0.05) {
      this.speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
    }
  }

  changeVolume = (event) => {
    const player = document.getElementById('audio')
    this.updateVolume(event)
      if (this.inRange(event)) {
        player.volume = this.getCoefficient(event);
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
      console.log("click")
      rangeBox = event.target.parentElement.parentElement;
    }
    if (event.type == 'mousemove') {
      console.log("mousemove")
      rangeBox = el.parentElement.parentElement;
    }
    return rangeBox;
  }

  render() {
    return (
      <div className="volume">
        <div onClick={this.switchVolume} className="volume-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path ref={(element) =>this.speaker = element} fill="#566574" fillRule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" id="speaker"/>
          </svg>
        </div>
        <div className="volume-controls">
            <div onClick={this.changeVolume} ref={(element => this.slider = element)} className="slider volume-slider">
              <div ref={(elem) => this.progress = elem} className="progress">
                <div onMouseDown={this.mouseDown} className="pin" id="volume-pin" data-method="changeVolume"></div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Volume;
