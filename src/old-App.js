import React, { Component } from 'react';
import logo from './logo.svg';
import { Button } from 'reactstrap';
import './App.css';
import { ReactBingmaps } from 'react-bingmaps';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bingmapKey: "AlZR2yc0TK1RQDUNBOIxxYR0ShV4EZcsq10Y2TF3LNDHSnuHt4pw8rXAxBaZpeu2",
    }
  }

  loadMapScenario() {
    this.map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
  }

  componentDidMount() {
    loadMapScenario();
  }
  
  render() {

    return (
      <div className="App">
      <head>
        <script type="text/javascript" src="https://www.bing.com/api/maps/mapcontrol?key=YourBingMapsKey"></script>
      </head>
      <body>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <div className = "container">
            <div className = "row">
              <div className = "col-4 panel" >
                Col 1
              </div>
              <div className = "col-8 map" id = "map" >
                Col 2
              </div>
            </div>
          </div>
      </body>
      </div>
    );
  }
}

export default App;
