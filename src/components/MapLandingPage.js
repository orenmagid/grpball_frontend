import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { Checkbox, Grid, Label, Header, Segment } from "semantic-ui-react";
import MapLandingSessionInfo from "../components/MapLandingSessionInfo";
import InteractiveSegment from "../components/InteractiveSegment";
import GroupCardMinimalDisplay from "../components/GroupCardMinimalDisplay";
import UserInfo from "../components/UserInfo";
import MediaQuery from "react-responsive";

// const baseUrl = "http://localhost:3000/api/v1";
const baseUrl = "https://grpball-backend.herokuapp.com/api/v1";

export class MapLandingPage extends Component {
  state = {
    selectedEvent: null,
    selectedGroup: null,
    whatToDisplayOnMap: "allSessions",
    userPosition: null
  };

  componentDidMount() {
    window.onload = () => {
      var startPos;
      var geoSuccess = position => {
        startPos = position;
        this.setState({
          userPosition: {
            lat: startPos.coords.latitude,
            lng: startPos.coords.longitude
          }
        });
      };
      navigator.geolocation.getCurrentPosition(geoSuccess);
    };
  }

  onMarkerClick = (props, marker, e) => {
    if (props.session) {
      if (
        this.state.selectedEvent &&
        this.state.selectedEvent.id === props.session.id
      ) {
        this.setState({ selectedEvent: null });
      } else {
        this.setState({
          selectedGroup: null,
          selectedEvent: props.session
        });
      }
    } else if (props.group) {
      if (
        this.state.selectedGroup &&
        this.state.selectedGroup.id === props.group.id
      ) {
        this.setState({
          selectedEvent: null,
          selectedGroup: null
        });
      } else {
        this.setState({
          selectedGroup: props.group,
          selectedEvent: null
        });
      }
    } else if (props.user) {
      if (
        this.state.displayedUser &&
        this.state.displayedUser.id === props.user.id
      ) {
        this.setState({
          displayedUser: null,
          selectedEvent: null
        });
      } else {
        this.setState({
          displayedUser: props.user,
          selectedEvent: null
        });
      }
    }
  };

  // onMouseoverMarker = (props, marker, e) => {
  //   if (props.group) {
  //     this.setState({ activeMarker: marker });
  //   } else if (props.session) {
  //     this.setState({ activeMarker: marker });
  //   }
  // };

  handleSelectEvent = event => {
    if (this.state.selectedEvent && this.state.selectedEvent.id === event.id) {
      this.setState({ selectedEvent: null });
    } else {
      this.setState({
        selectedEvent: event
      });
    }
  };

  handleCloseClick = () => {
    this.setState({
      selectedEvent: null,
      selectedGroup: null
    });
  };

  handleShowSession = currentSession => {
    this.setState({
      selectedEvent: currentSession
    });
  };

  handleToggle = whatToDisplay =>
    this.setState({
      whatToDisplayOnMap:
        this.state.whatToDisplayOnMap === whatToDisplay ? "" : whatToDisplay,
      selectedEvent: null,
      selectedGroup: null
    });

  render() {
    const { user, sessions, groups, users, createNewUser } = this.props;

    let initialCenter = {
      lat: 38.89511,
      lng: -77.03637
    };

    let markers;

    switch (this.state.whatToDisplayOnMap) {
      case "allSessions":
        markers = this.props.sessions.map(session => {
          return (
            <Marker
              key={session.id}
              session={session}
              title={session.group.name}
              name={session.location}
              position={{ lat: session.latitude, lng: session.longitude }}
              onClick={this.onMarkerClick}
              onMouseover={this.onMouseoverMarker}
            />
          );
        });
        break;

      case "allGroups":
        markers = this.props.groups.map(group => {
          return (
            <Marker
              key={group.id}
              group={group}
              title={group.name}
              name={group.location}
              position={{ lat: group.latitude, lng: group.longitude }}
              onClick={this.onMarkerClick}
              onMouseover={this.onMouseoverMarker}
            />
          );
        });
        break;
    }

    console.log("markers", markers);

    return (
      <React.Fragment>
        <Link to={`/new_user`}>
          <div className="ui huge primary button" onClick={createNewUser}>
            Create an Account <i className="right arrow icon" />
          </div>
        </Link>
        <Segment>
          Take a look at the map to find groups and sessions near you. Once you
          create an account, you can find users near you too.
        </Segment>
        <MediaQuery minWidth={992}>
          <div className="ui two column grid container segment">
            <div className="column">
              <Checkbox
                slider
                label="Browse Sessions"
                onChange={() => this.handleToggle("allSessions")}
                checked={this.state.whatToDisplayOnMap === "allSessions"}
              />
            </div>

            <div className="column">
              <Checkbox
                slider
                label="Browse Groups"
                onChange={() => this.handleToggle("allGroups")}
                checked={this.state.whatToDisplayOnMap === "allGroups"}
              />
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={992}>
          <Grid>
            <Grid.Column stretched centered width={2}>
              <Grid.Row verticalAlign="middle" />
              <Grid.Row verticalAlign="middle">
                <Checkbox
                  onChange={() => this.handleToggle("allSessions")}
                  checked={this.state.whatToDisplayOnMap === "allSessions"}
                />
                <br />
                <Header as="h5">All Sessions</Header>
              </Grid.Row>

              <Grid.Row verticalAlign="middle">
                <Checkbox
                  onChange={() => this.handleToggle("allGroups")}
                  checked={this.state.whatToDisplayOnMap === "allGroups"}
                />{" "}
                <br />
                <Header as="h5">All Groups</Header>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={14}>
              {this.state.selectedGroup ? (
                <GroupCardMinimalDisplay
                  sessions={sessions}
                  group={this.state.selectedGroup}
                  user={user}
                />
              ) : null}

              {this.state.selectedEvent ? (
                <MapLandingSessionInfo
                  group={this.state.selectedEvent.group}
                  handleCloseClick={this.handleCloseClick}
                  session={this.state.selectedEvent}
                />
              ) : null}

              <div className="ui raised container map segment">
                <Map
                  google={this.props.google}
                  zoom={8}
                  initialCenter={
                    this.state.userPosition
                      ? this.state.userPosition
                      : initialCenter
                  }
                >
                  {markers}
                  {this.state.selectedEvent ? (
                    <InfoWindow
                      marker={this.state.activeMarker}
                      visible="true"
                      onClose={this.onInfoWindowClose}
                    >
                      <div>
                        <h1>{this.state.selectedEvent.group.name}</h1>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Map>
              </div>
            </Grid.Column>
          </Grid>
        </MediaQuery>

        <MediaQuery minWidth={992}>
          {this.state.selectedGroup ? (
            <GroupCardMinimalDisplay
              handleCloseClick={this.handleCloseClick}
              sessions={sessions}
              group={this.state.selectedGroup}
              user={user}
            />
          ) : null}

          {this.state.selectedEvent ? (
            <MapLandingSessionInfo
              group={this.state.selectedEvent.group}
              handleCloseClick={this.handleCloseClick}
              session={this.state.selectedEvent}
            />
          ) : null}

          <div className="ui raised container map segment">
            <Map
              google={this.props.google}
              zoom={8}
              initialCenter={
                this.state.userPosition
                  ? this.state.userPosition
                  : initialCenter
              }
            >
              {markers}
              {this.state.selectedEvent ? (
                <InfoWindow
                  marker={this.state.activeMarker}
                  visible="true"
                  onClose={this.onInfoWindowClose}
                >
                  <div>
                    <h1>{this.state.selectedEvent.group.name}</h1>
                  </div>
                </InfoWindow>
              ) : null}
            </Map>
          </div>
        </MediaQuery>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDNfb_UadB3LFS4dbL9hbQRA-6wOV4jJTE"
})(MapLandingPage);
