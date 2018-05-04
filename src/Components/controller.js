import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import connect_to_socket from '../helpers/connect_to_socket';

class Controller extends Component {
  constructor(props){
    super(props);
    this.state = {
      tempo: 200,
      keyboard: [],
    };

    this.socket = connect_to_socket();

    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.transports = ['polling', 'websocket'];
    });
  }

  componentWillMount() {
    this.notes = this.noteList();
    this.socket.emit('client_connect', {data: 'I\'m connected!'});
    this.socket.on('connected_to_server', this.statusUpdate.bind(this));
    this.socket.on('disconnect', function() {console.log('disconnected')});
  }

  random_in_range(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  }

  statusUpdate(data){
    if (this.state.count === null) {
      this.setState({
        ...this.state,
        count: data.count
      });
    }
    console.log('my number is:', data.count)
  }

  sendmessage() {
    this.socket.emit('echo', {data: 'echooo'});
  }

  updateFreq(data){
    this.setState({
      ...this.state,
      freqs: data.freqs[0],
      loop_length: data.freqs[0].length
    });
  }

  startLoop(){
    console.log('start loop')
  }

  stopLoop() {
    console.log('stop loop')
  }

  handleTempoChange(value) {
    this.setState({
      ...this.state,
      tempo: value
    });
    clearInterval(this.interval);
    this.interval = null;
    this.interval = setInterval(() => this.iterateLoop(), value)
  }

  prepareLabels() {
    let labels = {};
    for (let i = 1; i < 11; i++) {
      labels[i] = i
    }
    return labels
  }

  noteList() {
    return {
      83: {m: 60, n: 'C', f: "261.6",},
      69: {m: 61, n: 'C#', f: "277.2",},
      68: {m: 62, n: 'D', f: "293.7",},
      82: {m: 63, n: 'D#', f: "311.1",},
      70: {m: 64, n: 'E', f: "329.6",},
      71: {m: 65, n: 'F', f: "349.2",},
      89: {m: 66, n: 'F#', f: "370.0",},
      72: {m: 67, n: 'G', f: "392.0",},
      85: {m: 68, n: 'G#', f: "415.0",},
      74: {m: 69, n: 'A', f: "440.0",},
      73: {m: 70, n: 'A#', f: "446.2",},
      75: {m: 71, n: 'B', f: "493.9",},
      76: {m: 72, n: 'C', f: "523.3",},
    };
  }

  onKeyboardChange(e) {
    e.preventDefault();
    let noteArray = this.state.keyboard;
    console.log(this.notes[e.which]);
    if (e.key === 'Enter') {
      noteArray = []
    } else {
      const value = this.notes[e.which];
      if (value) {
        noteArray.push(value.n)
      }
    }
    this.setState({
      ...this.state,
      keyboard: noteArray
    });
  }

  render() {
    return (
      <div className="App">
        <h2>| Phone Synth Controller |</h2>

        <div>
          <button
            type="button"
            onClick={this.startLoop.bind(this)}>
            loop
          </button>
          <button
            type="button"
            onClick={this.stopLoop.bind(this)}>
            stop loop
          </button>
        </div>

        <div style={{margin: "5%"}}>
          <p>Volume</p>
          <Slider
            value={this.state.tempo}
            tooltip={true}
            onChange={this.handleTempoChange.bind(this)}
            max={500}
            min={50}
          />
        </div>
        <div>
          <textarea value={this.state.keyboard.join('')} onKeyUp={this.onKeyboardChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

// const styles = {};

export default Controller;

