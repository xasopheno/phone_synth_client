import React, { Component } from 'react';

class Oscillator extends Component {
  constructor(props){
    super(props);
    this.oscillator = null;
    this.state = {
      value: 0,
      ctxCreated: false
    };
  }

  startAudio(){
    if (!this.ctx){
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();

      this.oscillator = this.ctx.createOscillator();
      this.oscillator.connect(this.gainNode);
      this.oscillator.start(this.ctx.currentTime);
      this.oscillator.type = 'sine';
    }

    this.gainNode.connect(this.ctx.destination);
    this.setState({
      ...this.state,
      ctxCreated: true,
    })
  }


  componentWillUpdate(nextProps){
    this.play(nextProps)
  }

  play(nextProps) {
    let value = nextProps.value || 0;
    if (this.ctx &&
      Math.floor(value) !== Math.floor(this.oscillator.frequency.value)
    ) {
      if (value === 0) {
        this.gainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.3);
      } else {
        console.log(value)
        this.gainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.001);
        this.oscillator.frequency.exponentialRampToValueAtTime(value,  this.ctx.currentTime + 0.003);
        this.gainNode.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.03)
      }
    }
  }

  render() {
    return (
      <div className="App">
        {
          !this.state.ctxCreated ?
            <button
              type="button"
              onClick={this.startAudio.bind(this)}
            >
              Join
            </button> :
            <p>Listen</p>
        }
      </div>
    );
  }
}


export default Oscillator;


