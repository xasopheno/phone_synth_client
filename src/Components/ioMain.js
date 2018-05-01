import React, { Component } from 'react';
import Oscillator from './Oscillator';
import 'react-rangeslider/lib/index.css'
import connect_to_socket from '../helpers/connect_to_socket';

class ioMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      freqs: [0],
      count: null,
      current_freq: 0,
      loop_length: 1,
      tempo: this.random_in_range(60, 180)
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
    this.socket.on('freq', this.updateFreq.bind(this))
    this.startLoop();
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
    this.socket.emit('echo', {data: 'echo'});
  }

  updateFreq(data){
    data = JSON.parse(data);
    let freq_array = [];
    data.freq.map((freq) => {
      freq_array.push(freq);
      return true;
    });

    this.setState({
      ...this.state,
      freqs: freq_array,
      loop_length: freq_array.length
    });

  }

  startLoop(){
    if (!this.interval) {
      this.interval = setInterval(() => this.iterateLoop(), this.state.tempo)
    }
  }

  iterateLoop(){
    let i = this.state.current_freq + 1;
    if (i > this.state.loop_length - 1) {
      i = 0
    }
    
    this.setState({ current_freq: i})
  }

  stopLoop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  handleLoopLengthChange(value) {
    this.setState({
      ...this.state,
      loop_length: value
    })
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

  renderFreqs() {
    return this.state.freqs.map((freq, index) => {
      return this.renderFreq(freq, index)
    })
  }

  renderFreq(freq, index) {
    if (index === this.state.current_freq) {
      return <p style={styles.random} key={index}>{freq}</p>
    } else if (index >= this.state.loop_length) {
      return <p style={{color: "#aaa"}} key={index}>{freq}</p>
    } else {
      return <p key={index}>{freq}</p>
    }
  }

  prepareLabels() {
    let labels = {};
    for (let i = 1; i < 11; i++) {
      labels[i] = i
    }
    return labels
  }

  render() {
    const oscillatorValue = this.state.freqs[this.state.current_freq];

    return (
      <div className="App">
        <h2>| Phone Synth |
          </h2>
        {this.renderFreqs()}
        <Oscillator value={oscillatorValue}/>

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

      </div>
    );
  }
}

const styles = {
  random: {
    overflowWrap: 'break-word',
    textAlign: 'center',
    color: '#ef6334',
  }
};

export default ioMain;

