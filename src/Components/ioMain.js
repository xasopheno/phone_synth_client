import React, { Component } from 'react';
// import ip from '../Server/ip.json';
import Oscillator from './Oscillator';
import io from 'socket.io-client';

class ioMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: 0,
      count: null,
    };

    // // this.socket = openSocket(`ws://${this.readTextFile()}:5678/`);
    this.socket = io('localhost:8000');

    console.log('test')
  }

  componentWillMount() {
    console.log('componentWillMount');

    // this.socket.on('connect', function() {

    this.socket.emit('client_connect', {data: 'I\'m connected!'});

    this.socket.on('connected_to_server', this.statusUpdate.bind(this));

    this.socket.on('disconnect', function() {
     console.log('disconnected')
    });

    this.socket.on('freq', this.updateFreq.bind(this))
  }

  statusUpdate(data){
    if (this.state.count == null) {
      this.setState({
        ...this.state,
        count: data.count
      });
    }
    console.log('my number is:', data.count)
  }

  sendmessage() {
    this.socket.emit('echo', {data: 'echooo'});
    console.log('emitted echo')
  }

  updateFreq(data){
    console.log(this.state.count)
    let freq = data.freq1;
    if (this.state.count % 2 === 0) {
      freq = data.freq2;
    }

    console.log(freq)
;
    this.setState({
      ...this.state,
      data: freq
    })
  }



  render() {
    return (
      <div className="App">
        <h2>| Phone Synth |</h2>
        <h2 style={styles.random}>{this.state.data}</h2>
        <Oscillator value={this.state.data}/>
        <button
          type="button"
          onClick={this.sendmessage.bind(this)}
        >
          button
        </button>
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

export default ioMain;

