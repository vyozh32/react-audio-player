import React, { Component } from 'react';
import axios from 'axios';
// import Player from './Player'
import Audio from './Audio'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.settings = {
      canvas_width: 400,
      canvas_height: 45,
      bar_width: 3,
      bar_gap : 0.3,
      wave_color: "#66666670",
      download: false,
      onComplete: function(png, pixels) {}
    }

    this.SoundCloudWaveform = {
      settings : this.settings,
    
      audioContext: new AudioContext(),
    
      generate: function(url, options) {

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

  componentDidMount () {
    const options = {
      canvas_height: 45,
      onComplete: function(png, pixels) {
        var canvas = document.getElementById('showcase');
        var context = canvas.getContext('2d');
        context.putImageData(pixels, 0, 0);
      }
    };

    this.SoundCloudWaveform.generate('./muse.mp3', options);

    var audioPlayer = document.querySelector('.green-audio-player');
    var playPause = audioPlayer.querySelector('#playPause');
    var playpauseBtn = audioPlayer.querySelector('.play-pause-btn');
    var loading = audioPlayer.querySelector('.loading');
    var progress = audioPlayer.querySelector('.progress');
    var sliders = audioPlayer.querySelectorAll('.slider');
    var volumeBtn = audioPlayer.querySelector('.volume-btn');
    var volumeControls = audioPlayer.querySelector('.volume-controls');
    var volumeProgress = volumeControls.querySelector('.slider .progress');
    var player = audioPlayer.querySelector('audio');
    var currentTime = audioPlayer.querySelector('.current-time');
    var totalTime = audioPlayer.querySelector('.total-time');
    var speaker = audioPlayer.querySelector('#speaker');

    var draggableClasses = ['pin'];
    var currentlyDragged = null;


    window.addEventListener('mousedown', function (event) {


      if (!isDraggable(event.target)) return false;

      currentlyDragged = event.target;
      var handleMethod = currentlyDragged.dataset.method;

      this.addEventListener('mousemove', rewind, false);

      this.addEventListener('mousemove', changeVolume, false);


      window.addEventListener('mouseup', function () {
        currentlyDragged = false;
        window.removeEventListener('mousemove', rewind, false);
        window.removeEventListener('mousemove', changeVolume, false);
      }, false);
      
    });

      playpauseBtn.addEventListener('click', togglePlay);
      player.addEventListener('timeupdate', updateProgress);
      player.addEventListener('volumechange', updateVolume);
      player.addEventListener('loadedmetadata', function () {
        totalTime.textContent = formatTime(player.duration);
      });
      player.addEventListener('canplay', makePlay);
      player.addEventListener('ended', function () {
        playPause.attributes.d.value = "M18 12L0 24V0";
        player.currentTime = 0;
      });

      volumeBtn.addEventListener('click', function () {
        volumeBtn.classList.toggle('open');
        volumeControls.classList.toggle('hidden');
      });


      sliders.forEach(function (slider) {
        var pin = slider.querySelector('.pin');
        slider.addEventListener('click', rewind);

      });

      function isDraggable(el) {
        var canDrag = false;
        var classes = Array.from(el.classList);
        draggableClasses.forEach(function (draggable) {
          if (classes.indexOf(draggable) !== -1) canDrag = true;
        });
        return canDrag;
      }

      function inRange(event) {
        var rangeBox = getRangeBox(event);
        var rect = rangeBox.getBoundingClientRect();
        var direction = rangeBox.dataset.direction;
        if (direction == 'horizontal') {
          var min = rect.left;
          var max = min + rect.right;
          if (event.clientX < min || event.clientX > max) return false;
        } else {
          var min = rect.top;
          var max = min + rangeBox.offsetHeight;
          if (event.clientY < min || event.clientY > max) return false;
        }
        return true;
      }

      function updateProgress() {
        var current = player.currentTime;
        var percent = (current / player.duration) * 100;
        progress.style.width = percent + '%';

        currentTime.textContent = formatTime(current);
      }

      function updateVolume() {
        volumeProgress.style.height = player.volume * 100 + '%';
        if (player.volume >= 0.5) {
          speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
        } else if (player.volume < 0.5 && player.volume > 0.05) {
          speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
        } else if (player.volume <= 0.05) {
          speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
        }
      }

      function getRangeBox(event) {
        var rangeBox = event.target;
        var el = currentlyDragged;
        if (event.type == 'click' && isDraggable(event.target)) {
          rangeBox = event.target.parentElement.parentElement;
        }
        if (event.type == 'mousemove') {
          rangeBox = el.parentElement.parentElement;
        }
        return rangeBox;
      }

      function getCoefficient(event) {
        var slider = getRangeBox(event);
        var rect = slider.getBoundingClientRect();
        var K = 0;
        if (slider.dataset.direction == 'horizontal') {
          var offsetX = event.clientX - rect.left;
          var width = slider.clientWidth;
          K = offsetX / width;
        } else if (slider.dataset.direction == 'vertical') {

          var height = slider.clientHeight;
          var offsetY = event.clientY - rect.top;
          K = 1 - offsetY / height;
        }
        return K;
      }

      function rewind(event) {
        if (inRange(event)) {
          player.currentTime = player.duration * getCoefficient(event);
        }
      }

      function changeVolume(event) {
        if (inRange(event)) {
          player.volume = getCoefficient(event);
        }
      }

      function formatTime(time) {
        var min = Math.floor(time / 60);
        var sec = Math.floor(time % 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
      }

      function togglePlay() {
        if (player.paused) {
          playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
          player.play();
        } else {
          playPause.attributes.d.value = "M18 12L0 24V0";
          player.pause();
        }
      }

      function makePlay() {
        playpauseBtn.style.display = 'block';
        loading.style.display = 'none';
      }
  }
  
  render() {
  
    return (
      <div className="App">
        <Audio 
          url="../muse.mp3"
          width={this.settings.canvas_width}
          height={this.settings.canvas_height}
          height2={35}
        />
      </div>
    );
  }
}

export default App;
