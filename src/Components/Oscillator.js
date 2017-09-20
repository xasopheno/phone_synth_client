import React, { Component } from 'react';

class Oscillator extends Component {
  constructor(props){
    super(props);
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.state = {
      values: [300, 400, 102]
    };
  }

  componentDidMount(){
    this.chord()
  }


  // create Oscillator
  oscillator(value) {
    let oscillator = this.audioCtx.createOscillator();
    console.log(oscillator);
    oscillator.type = 'sine';
    oscillator.frequency.value = value; // value in hertz
    oscillator.start();
    oscillator.connect(this.audioCtx.destination);
  }

  chord(){
    for (var i = 0; i < this.state.values.length; i++) {
      this.oscillator(this.state.values[i])
    }
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

const styles = {
  random: {
    overflowWrap: 'break-word',
    textAlign: 'center',
    color: 'green',
  }
};

export default Oscillator;


