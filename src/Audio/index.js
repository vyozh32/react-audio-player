import React, { Component } from 'react';
import axios from 'axios';

import PlayButton from "../PlayButton";
import Controls from '../Controls'
import Volume from '../Volume'

class Audio extends Component {
  constructor(props) {
    super(props)

    this.player = React.createRef();

    this.state = {
      canvas_width: 611,
      canvas_height: 55,
      bar_width: 3,
      bar_gap : 0.3,
      wave_color: "#66666670",
      download: false,
      onComplete: function(png, pixels) {
        let canvas = document.getElementById('showcase');
        let context = canvas.getContext('2d');
        context.putImageData(pixels, 0, 0);
      }
    }

    this.SoundCloudWaveform = {
      settings : this.state,
    
      audioContext: new AudioContext(),
    
      generate: function(url, options) {
        console.log(options)
        // preparing canvas
        this.settings.canvas = document.createElement('canvas');
        this.settings.context = this.settings.canvas.getContext('2d');
    
        this.settings.canvas.width = (options.canvas_width !== undefined) ? parseInt(options.canvas_width) : this.settings.canvas_width;
        this.settings.canvas.height = (options.canvas_height !== undefined) ? parseInt(options.canvas_height) : this.settings.canvas_height;
    
        // setting fill color
        this.settings.wave_color = (options.wave_color !== undefined) ? options.wave_color : this.settings.wave_color;
    
        // setting bars width and gap
        this.settings.bar_width = (options.bar_width !== undefined) ? parseInt(options.bar_width) : this.settings.bar_width;
        this.settings.bar_gap = (options.bar_gap !== undefined) ? parseFloat(options.bar_gap) : this.settings.bar_gap;
    
        this.settings.download = (options.download !== undefined) ? options.download : this.settings.download;
    
        this.settings.onComplete = (options.onComplete !== undefined) ? options.onComplete : this.settings.onComplete;
    
        // read file buffer

        axios.get(url, {
          responseType: 'arraybuffer'
        }).then(res => {
          return res 
        })
        .then(response => {
            this.audioContext.decodeAudioData(response.data, function(buffer) {
              this.extractBuffer(buffer);
          }.bind(this));
      });
      },
    
      extractBuffer: function(buffer) {
          buffer = buffer.getChannelData(0);
          var sections = this.settings.canvas.width;
          var len = Math.floor(buffer.length / sections);
          var maxHeight = this.settings.canvas.height;
          var vals = [];
          for (var i = 0; i < sections; i += this.settings.bar_width) {
              vals.push(this.bufferMeasure(i * len, len, buffer) * 10000);
          }
    
          for (var j = 0; j < sections; j += this.settings.bar_width) {
          
              var scale = maxHeight / Math.max.apply(null, vals);

              var val = this.bufferMeasure(j * len, len, buffer) * 10000;
              val *= scale;
              val += 1;
              this.drawBar(j, val);
          }
    
          if (this.settings.download) {
            this.generateImage();
          }
          this.settings.onComplete(this.settings.canvas.toDataURL('image/png'), this.settings.context.getImageData(0, 0, this.settings.canvas.width, this.settings.canvas.height));
          // clear canvas for redrawing
          this.settings.context.clearRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
        },
    
        bufferMeasure: function(position, length, data) {
            var sum = 0.0;
            for (var i = position; i <= (position + length) - 1; i++) {
                sum += Math.pow(data[i], 2);
            }
            return Math.sqrt(sum / data.length);
        },
    
        drawBar: function(i, h) {
    
          this.settings.context.fillStyle = this.settings.wave_color;
    
        var w = this.settings.bar_width;
            if (this.settings.bar_gap !== 0) {
                w *= Math.abs(1 - this.settings.bar_gap);
            }
            var x = i + (w / 2),
                y = this.settings.canvas.height - h;
    
            this.settings.context.fillRect(x, y, w, h);
        },
    }
  }
  state = {
    isPlayed: false,
    canPlay: false
  }

  componentDidMount() {
    const slider = document.getElementById('progress-slider')
    const data = slider.getBoundingClientRect();
    this.setState({
      canvas_width: Math.floor(data.width) - 4
    }, () => {
      this.SoundCloudWaveform.generate('./muse.mp3', this.state)
  })
    this.player.addEventListener('canplay', this.startPlay, false)
  }
  
  startPlay = () => {
    this.setState({
      canPlay: !this.state.canPlay
    })
  }

  playPause = () => {
    this.setState({
      isPlayed: !this.state.isPlayed
    }, this.togglePlay)
  }

  togglePlay = () => {
    if (this.state.isPlayed) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  getWidth = (width) => {
    this.setState({
      canvas_width: width
    })
  }

  render() {
    return (
      <div className="audio green-audio-player">
            { this.state.canPlay ? 
              <PlayButton 
                canPlay={this.state.canPlay}
                isPlayed={this.state.isPlayed}
                playPause={this.playPause}
              />
              : 
              <div className="loading">
                <div className="spinner"></div>
              </div>
            }
            <Controls getWidth={this.getWidth} width={this.state.canvas_width}/>
            <Volume 
              setVolume={this.setVolume} 
              player={this.player}
            />
            <audio ref={element => this.player = element} id="audio" crossOrigin="true" loop>
              <source src="../muse.mp3" type="audio/mpeg"/>
            </audio>
        </div>
    );
  };
}

export default Audio;