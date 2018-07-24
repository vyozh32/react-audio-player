import React, { Component } from 'react';
import Audio from './Audio'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="App">
        <Audio 
          url="../muse.mp3"
        />
      </div>
    );
  }
}

export default App;
