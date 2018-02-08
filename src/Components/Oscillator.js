import React, { Component } from 'react';

class Oscillator extends Component {
  constructor(props){
    super(props);
    this.oscillators = [];
    this.state = {
      value: 0,
      ctxCreated: false
    };
  }

  startAudio(){
    if (!this.ctx){
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();

        for(let i = 0; i < 4; i++) {
          this.oscillators[i] = this.ctx.createOscillator();
      }
      for(let j = 0; j < 4; j++){
        this.oscillators[j].connect(this.gainNode);
        this.oscillators[j].start(this.ctx.currentTime);
        this.oscillators[j].type = 'sine';
      }

      this.gainNode.connect(this.ctx.destination);
      this.setState({
        ...this.state,
        ctxCreated: true,
      })
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.value && nextProps.value !== 0 && this.props.value === 0) {
      this.gainNode.gain.exponentialRampToValueAtTime(.04, this.ctx.currentTime + 0.02);
    }
  }

  componentDidUpdate(){
    this.play()
  }

  play() {
    if (this.ctx) {
      if (this.props.values === 0) {
        this.gainNode.gain.exponentialRampToValueAtTime(0, this.ctx.currentTime + 0.01);
      }
      this.oscillators[0].frequency.setValueAtTime(this.props.value, this.ctx.currentTime + 0);
      this.oscillators[1].frequency.setValueAtTime(this.props.value, this.ctx.currentTime + 0);
      this.oscillators[2].frequency.setValueAtTime(this.props.value * 2, this.ctx.currentTime + 0);
      this.oscillators[3].frequency.setValueAtTime(this.props.value * 4, this.ctx.currentTime + 0);

      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      let gain = .04;
      if (this.props.value < 500){
        gain = .05;
      }
      this.gainNode.gain.exponentialRampToValueAtTime(gain, this.ctx.currentTime + 0.01);
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


