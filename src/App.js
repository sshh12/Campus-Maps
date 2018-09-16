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
      location: "",
      isLoaded: false
    }
  }

  onClickEvent() {
    console.log("Begin");

    console.log("End");
    //window.createEvent("hhji", "hjhjhe", 67,667);
  }

  render() {
    return (
      <div className = "event" onClick={() => this.onClickEvent()}>
        <p className="align-left">
          <b>{this.props.name}</b>
        </p>
        <p className="align-right">
          When: {this.props.time}
        </p>
        <br/><br/>
         <p className="align-right">
          Where: {this.props.location}
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
      user: null,
      bingmapKey: "AlZR2yc0TK1RQDUNBOIxxYR0ShV4EZcsq10Y2TF3LNDHSnuHt4pw8rXAxBaZpeu2",
      pushPins: [],
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
        let desc = "where: "+ event.location+"<br>start: "+this.convertUnixTime(event.startTime)+"<br>end: "+this.convertUnixTime(event.endTime)
        coordinates.push({
            "location": [event.latitude, event.longitude],
            "addHandler": "mouseover",
            "infoboxOption": {title: event.title, description: desc},
            "pushPinOption":{ title: event.title, description: 'Pushpin' },
            "infoboxAddHandler": {"type" : "click", callback: () => {} },
            "pushPinAddHandler": {"type" : "click", callback: () => {} },
          });
        eventElems.push(<Event coordinates={[event.latitude, event.longitude]}
                                name = {event.title}
                                time = {this.convertUnixTime(event.startTime)}
                                location = {event.location}
                                />)
      }

      this.setState( {
        pushPins : coordinates,
        eventElems: eventElems,
        displayElems: eventElems,
      }, () => {this.setState({isLoaded: true});});

    });

  }

  callBackMethod() {
    console.log("hey");
  }

  searchEvents() {

  }

  onLogIn = (user) => {
    this.setState({user: user})
  }

  // LEFT PANEL
/*  getEvents() {
    if (this.state.active === "All Events") {
      return this.state.eventElems;
    }
    else {
      return this.state.eventElems[0];
    }
  } */

  onClickAllEvents() {
    this.setState({displayElems: this.state.eventElems});
  }

  onClickMyEvents() {
    if (window.backend.user == null)
    {
      window.logIn(this.onLogIn);
    }

    else {
      window.getAttendingEvents((myEvents) => {
        this.setState({displayElems: myEvents});
      });
    }

  }

  convertUnixTime(time) {
    let date = new Date(time)
    return date.toLocaleTimeString()
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="App">
        </div>
      );
    } else {
      return (
        <div className="App">
          <nav className="navbar navbar-default navbar-fixed-top">
           <div className="container">
              <h3 className="navbar-left">Campus Maps</h3>
               <Button className = "navbar-right" color="primary" onClick={() => (this.state.user == null) ? window.logIn(this.onLogIn) : null} >{(this.state.user == null) ? "Login" : window.backend.user.displayName}</Button>
            </div>
          </nav>
         <div className = "container-fluid">
              <div className = "row">
                <div className = "col-4 panel scrollable" >
                  <div className="search-header">
                    <div className = "menu">
                      <Button color="primary" onClick = {() => this.onClickAllEvents()}>All Events</Button>{' '}
                      <Button color="success" onClick = {() => this.onClickMyEvents()}>My Events</Button>
                    </div>
                  </div>
                  <div className = "event-results">
                    {this.state.displayElems}
                  </div>
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
