import React, { Component } from 'react';
import ip from '../../Server/ip.json';
import Oscillator from './Oscillator';

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      data: null,
    };

    this.socket = new WebSocket(`ws://${this.readTextFile()}:5678/`);
  }

  componentWillMount() {
    this.readTextFile()
  }

  readTextFile() {
    return ip.ip
  }


  componentDidMount() {
    this.socket.onopen = () => this.socket.send(JSON.stringify({type: 'greet', payload: 'Hello Mr. Server!'}));
    this.socket.onmessage = ({data}) => this.processData(data);
  }

  processData(data) {
    if (!parseInt(data, 10)){
      data = 0
    };
    this.setState({
      ...this.state,
      data: data
    })
  }



  render() {
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

export default Main;
