import React, { Component } from 'react';
import logo from './logo.svg';
import { Button } from 'reactstrap';
import './App.css';
import { ReactBingmaps } from 'react-bingmaps';
import { FlatList } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const colors = {"Interested":"warning", "Going": "success", "Not Going": "danger", "Select": "primary"};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      status: props.status
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret color = {colors[this.state.status]}>
          {this.state.status}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => this.markInterested()}>Interested</DropdownItem>
          <DropdownItem onClick={() => this.markGoing()}>Going</DropdownItem>
          <DropdownItem onClick={() => this.markNotGoing()}>Not Going</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }

  markInterested() {
    window.updateEventInterest(this.props.eventId, window.backend.user.uid);
    this.setState({status: "Interested"});

  }

  markGoing() {
    window.updateEventAttending(this.props.eventId, window.backend.user.uid);
    this.setState({status: "Going"});
  }

  markNotGoing() {
    window.updateNotEventAttending(this.props.eventId, window.backend.user.uid);
    this.setState({status: "Not Going"});
  }

}

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
        <br />
        <div className="clear-float">
        </div>
        <div class = "row">
          <div class = "col-6">
            {window.backend.user !== null && <Dropdown className="align-left" status = {this.props.status} eventId = {this.props.id} />}
          </div>
          <div class = "col-6">
            <p className = "align-right">Where: {this.props.location}</p>
          </div>
        </div>
        <div className="clear-float">
        </div>
      </div>

    );
  }

  getEventUserStatus() {
    const status = "Select";
    return status;
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      bingmapKey: "AlZR2yc0TK1RQDUNBOIxxYR0ShV4EZcsq10Y2TF3LNDHSnuHt4pw8rXAxBaZpeu2",
      pushPins: [],
      userEvents: []
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
                                id = {event.key}
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

  onLogIn = (user) => {
    this.setState({user: user}, () => {
        this.usableGetAttendingEvents();
        this.usableGetInterestedEvents();
      //  this.markAllEvents()
      }, () => { console.log("Successfully logged in")}
    );

    }

  // LEFT PANEL

  /*Called once the user logs in. */
  markAllEvents = () => {
    let attending =  this.state.userEvents;
    let interested = this.state.interestedEvents;
    let allEvents = this.state.eventElems;
    let markedEvents = [];
    for (let i = 0; i < allEvents.length; i ++) {
      console.log("iterating through markAllEvents loop");
      console.log(attending);
      const event = allEvents[i];
      if (attending.indexOf(event) > -1) {
        markedEvents.push(<Event coordinates={[event.latitude, event.longitude]}
          id = {event.key}
          name = {event.title}
          time = {this.convertUnixTime(event.startTime)}
          location = {event.location}
          status = "Going"
          />);
        }
      else if (interested.indexOf(event) > -1) {
        markedEvents.push(<Event coordinates={[event.latitude, event.longitude]}
          id = {event.key}
          name = {event.title}
          time = {this.convertUnixTime(event.startTime)}
          location = {event.location}
          status = "Interested"
          />);
        }
      else {
        markedEvents.push(<Event coordinates={[event.latitude, event.longitude]}
          id = {event.key}
          name = {event.title}
          time = {this.convertUnixTime(event.startTime)}
          location = {event.location}
          status = "Select"
          />);
      }
    }
    console.log("markedAllEvents");
    console.log(markedEvents);
    this.setState({eventElems : markedEvents, userEvents : attending, interestedEvents : interested});
  }

  onClickAllEvents = () => {
    this.usableGetAttendingEvents();
    this.usableGetInterestedEvents();
    this.setState({displayElems: this.state.eventElems});
  }

  onClickMyEvents = () => {
    if (window.backend.user == null)
    {
      window.logIn(this.onLogIn);
    }

    else {
      window.getAttendingEvents(myEvents => {
        let correctEvents = [];
        for (let i = 0; i < myEvents.length; i ++) {
          const event = myEvents[i];
          if (event !== null ) {
            correctEvents.push(<Event coordinates={[event.latitude, event.longitude]}
                id = {event.key}
                name = {event.title}
                time = {this.convertUnixTime(event.startTime)}
                location = {event.location}
                status = "Going" />);
            }
        }

        this.setState({displayElems: correctEvents});
      });
    }

  }

  usableGetAttendingEvents = () => {

    window.getAttendingEvents(myEvents => {
      let correctEvents = [];
      for (let i = 0; i < myEvents.length; i ++) {
        const event = myEvents[i];
        if (event !== null ) {
          correctEvents.push(<Event coordinates={[event.latitude, event.longitude]}
                id = {event.key}
                name = {event.title}
                time = {this.convertUnixTime(event.startTime)}
                location = {event.location}
                status = "Going" />);
        }
      }
      this.setState({userEvents : correctEvents});
    });
  }

  usableGetInterestedEvents = () => {
    window.getInterestedEvents(myEvents => {
      let correctEvents = [];
      for (let i = 0; i < myEvents.length; i ++) {
        const event = myEvents[i];
        if (event !== null ) {
          correctEvents.push(<Event coordinates={[event.latitude, event.longitude]}
                  id = {event.key}
                  name = {event.title}
                  time = {this.convertUnixTime(event.startTime)}
                  location = {event.location}
                  status = "Interested" />);
        }
      }
      this.setState({interestedEvents : correctEvents});
    });
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
              <div className = "row one-page">
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
