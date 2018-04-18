import React, { Component } from 'react';
// import ip from '../Server/ip.json';
import Oscillator from './Oscillator';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import connect_to_socket from '../helpers/connect_to_socket';

class ioMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      freqs: [0],
      count: null,
      part: 1,
      current_freq: 0,
      loop_length: this.random_in_range(2, 4),
      tempo: 200
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
  }

  random_in_range(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  }

  prepareBuffer() {
    let buffer = [];
    for (let i = 0; i < 10; i ++) {
      buffer.push(0)
    }
    return buffer
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
    data = JSON.parse(data);
    console.log(data)
    let freq_array = []
    data.freq.map((freq) => {
      freq_array.push(freq)
    });
    // console.log(freq_array);

    this.setState({
      ...this.state,
      freqs: freq_array,
      loop_length: freq_array.length
    });


    // if (this.interval) {
    //   this.iterateLoop();
    // }
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
    return (
      <div className="App">
        <h2>| Phone Synth |
          {/*Part {this.state.part} */}
          </h2>
        {this.renderFreqs()}
        <Oscillator value={this.state.freqs[this.state.current_freq]}/>
        <button
          type="button"
          onClick={this.sendmessage.bind(this)}>
          note
        </button>

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
          <Slider
            value={this.state.loop_length}
            tooltip={true}
            onChange={this.handleLoopLengthChange.bind(this)}
            max={10}
            min={1}
          />
        </div>

        <div style={{margin: "5%"}}>
          <Slider
            value={this.state.tempo}
            tooltip={true}
            onChange={this.handleTempoChange.bind(this)}
            max={1000}
            min={50}
          />
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

