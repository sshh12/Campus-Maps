import React, { Component } from 'react';
import logo from './logo.svg';
import { Button } from 'reactstrap';
import './App.css';
import { ReactBingmaps } from 'react-bingmaps';
import { FlatList } from 'react';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Event",
      time: "",
      coordinates: [0,0],
      isLoaded: false
    }
  }

  onClickEvent() {
    alert("Hello! I am an Angera");
  }

  render() {
    return (
      <div className = "event" onClick={() => this.onClickEvent()}>
        <p className="align-left">
          Name: {this.props.name}
        </p>
        <p className="align-right">
          Time: {this.props.time}
        </p>
        <div className="clear-float">
        </div>
      </div>

    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bingmapKey: "AlZR2yc0TK1RQDUNBOIxxYR0ShV4EZcsq10Y2TF3LNDHSnuHt4pw8rXAxBaZpeu2",
      pushPins: []
    }
  }

  // invoked immediately after component is mounted (inserted into the tree)
  componentDidMount() {

    console.log("componentDidMount()");

    window.readyForStuff = this.readyForStuff.bind(this);

  }

  readyForStuff() {

    window.getEvents(events => {

      console.log(events);

      let eventElems = [];
      const coordinates = [];

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        coordinates.push({
            "location": [29.718037, -95.402340],
            "addHandler": "mouseover",
            "infoboxOption": {title: event.title},
            "pushPinOption":{ title: event.title, description: 'Pushpin' },
            "infoboxAddHandler": {"type" : "click", callback: () => {} },
            "pushPinAddHandler": {"type" : "click", callback: () => {} },
          });
        eventElems.push(<Event coordinates={[29.718037, -95.402340]} name = {event.title} time = "12:00" />)
      }

      this.setState( {
        pushPins : coordinates,
        eventElems: eventElems,
      }, () => {this.setState({isLoaded: true});});

    });

  }

  getCurrentEvents() {
    return this.state.eventElems;
  }

  callBackMethod() {
    console.log("hey");
  }

  searchEvents() {

  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="App">
         <div className = "container-fluid">
              <div className = "row">
                <div className = "col-4 panel" >
                  <div className="search-header">
                    <div className = "block">
                      <form>
                        <input type="text" placeholder="Angera Search..."/>
                        <Button color="primary" onClick={() => this.searchEvents()} >Search</Button>{' '}
                      </form>
                    </div>
                    <div className = "menu">
                      <Button color="primary">All Events</Button>{' '}
                      <Button color="success">My Events</Button>{' '}
                    </div>
                  </div>
                  {this.getCurrentEvents()}
                </div>
                <div className = "col-8 map" id = "map" >
                </div>
              </div>
            </div>
        </div>
      );
    } else {
      return (
        <div className="App">
         <div className = "container-fluid">
              <div className = "row">
                <div className = "col-4 panel" >
                  <div className="search-header">
                    <div className = "block">
                      <form>
                        <input type="text" placeholder="Angera Search..."/>
                        <Button color="primary" onClick={() => this.searchEvents()} >Search</Button>{' '}
                      </form>
                    </div>
                    <div className = "menu">
                      <Button color="primary">All Events</Button>{' '}
                      <Button color="success">My Events</Button>{' '}
                    </div>
                  </div>
                  {this.getCurrentEvents()}
                </div>
                <div className = "col-8 map" id = "map" >
                  <Map
                    isLoaded = {this.state.isLoaded}
                    bingmapKey = {this.state.bingmapKey}
                    pushPins = {this.state.pushPins}>
                  </Map>
                </div>
              </div>
            </div>
        </div>
      );
    }
  }
}

class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<ReactBingmaps
      id = "one"
      bingmapKey = {this.props.bingmapKey}
      center = {[29.716830466, -95.40166506]}
      zoom = {16}
      className = "bingMap"
      infoboxesWithPushPins = { this.props.pushPins }
    >
    </ReactBingmaps> );
  }


}

export default App;
