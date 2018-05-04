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

  onKeyboardChange(e) {
    e.preventDefault();
    let note = e.key;
    
    let noteArray = this.state.keyboard;
    if (e.key === 'Enter') {
      noteArray = []
    } else {
      noteArray.push(e.which)
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
          <textarea value={this.state.keyboard} onKeyUp={this.onKeyboardChange.bind(this)}/>
        </div>
      </div>
    );
  }
}

const styles = {};

export default Controller;

