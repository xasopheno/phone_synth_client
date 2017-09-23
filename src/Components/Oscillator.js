import React, { Component } from 'react';

class Oscillator extends Component {
  constructor(props){
    super(props);
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();
    this.oscillator.connect(this.gainNode);
    this.oscillator.start(this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    this.oscillator.type = 'sine';


    this.state = {
      value: 300
    };
  }

  componentDidMount(){
    this.play()
  }

  componentDidUpdate(){
    this.play()
  }

  play() {

    if (this.ctx) {
      this.oscillator.frequency.value = this.props.value;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.03);
    }
  }

  render() {

    return (
      <div className="App">
      </div>
    );
  }
}


export default Oscillator;


