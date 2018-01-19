import React, { Component } from 'react';
// import ip from '../Server/ip.json';
import Oscillator from './Oscillator';
// import io from 'socket.io-client';

class ioMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: null,
    };

    // // this.socket = openSocket(`ws://${this.readTextFile()}:5678/`);
    // this.socket = io('http://0.0.0.0:8080/test')
    //
    // console.log(this.socket)
    console.log('test')
  }

  // componentWillMount() {
  //   console.log('test')
  //
  //   // this.socket.on('connect', function() {
  //   this.socket.emit('connect', {data: 'I\'m connected!'});
  //   // });
  //   this.socket.on('disconnect', function() {
  //    console.log('disconnected')
  //   });
  //   this.socket.on('freq', function(msg) {
  //     console.log(msg.data)
  //   });
  //
  // }

  // readTextFile() {
  //   return ip.ip
  // }


  // componentDidMount() {
  //   this.socket.onmessage = ({data}) => this.processData(data);
  // }
  //
  // processData(data) {
  //   if (!parseInt(data, 10)){
  //     data = 0
  //   };
  //   this.setState({
  //     ...this.state,
  //     data: data
  //   })
  // }



  render() {
    console.log('test')
    console.log(this.state.data);
    return (
      <div className="App">
        <h2>| Phone Synth |</h2>
        <h2 style={styles.random}>{this.state.data}</h2>
        <Oscillator value={this.state.data}/>
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

