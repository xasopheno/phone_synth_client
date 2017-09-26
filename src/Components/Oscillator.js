import React, { Component } from 'react';

class Oscillator extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0
    };
  }

  startAudio(){
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.ctx.createGain();

    this.oscillators = [];
      for(let i = 0; i < 4; i++) {
        this.oscillators.push(this.ctx.createOscillator());
    }
    for(let j = 0; j < 4; j++){
      console.log(j, this.oscillators[j])
      this.oscillators[j].connect(this.gainNode);
      this.oscillators[j].start(this.ctx.currentTime);
      this.oscillators[j].type = 0;
    }

    this.gainNode.connect(this.ctx.destination);
  }

  componentDidUpdate(){
    this.play()
  }


  play() {
    if (this.ctx) {
      this.oscillators[0].frequency.setValueAtTime(this.props.value * 2, this.ctx.currentTime);
      this.oscillators[1].frequency.setValueAtTime(this.props.value * 3/2, this.ctx.currentTime + .5);
      this.oscillators[2].frequency.setValueAtTime(this.props.value * 5/4, this.ctx.currentTime + .1);
      this.oscillators[3].frequency.setValueAtTime(this.props.value, this.ctx.currentTime + .15);

      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      let gain = .2;
      if (this.props.value < 500){
        gain = .3;
      }
      this.gainNode.gain.exponentialRampToValueAtTime(gain, this.ctx.currentTime + 0.03);
    }
  }

  render() {

    return (
      <div className="App">
        <button
          type="button"
          onClick={this.startAudio.bind(this)}
        >
          Join
        </button>
      </div>
    );
  }
}


export default Oscillator;


