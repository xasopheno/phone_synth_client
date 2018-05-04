import React, { Component } from 'react';
import './App.css';
import Main from './Components/ioMain.js'
import Controller from './Components/controller';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Main}/>
          <Route path="/controller" component={Controller}/>
        </div>
      </Router>
    );
  }
}

export default App;
