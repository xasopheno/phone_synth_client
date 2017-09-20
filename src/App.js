import React, { Component } from 'react';
import './App.css';
import Main from './Components/Main.js'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      test: '| Phones Synth |'
    }
  }
  render() {
    return (
      <div className="App">
        <Main/>
      </div>
    );
  }
}

export default App;
