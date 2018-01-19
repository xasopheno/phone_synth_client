import React, { Component } from 'react';
import './App.css';
import Main from './Components/ioMain.js'
// import MyMain from './Components/ioMain';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      test: '| Phones Synth |'
    }
  }
  render() {
    console.log('app.js')
    return (
      <div className="App">
        <Main />
      </div>
    );
  }
}

export default App;
