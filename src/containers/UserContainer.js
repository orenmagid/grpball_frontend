import React from "react";
import { Route } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import UserDashboard from "./UserDashboard";
import GroupDashboard from "./GroupDashboard";
import SessionsDashboard from "./SessionsDashboard";
import UserFeed from "../components/UserFeed";
import { Segment } from "semantic-ui-react";
import { ActionCable } from "react-actioncable-provider";
import { API_ROOT } from "../constants";

const baseUrl = "http://localhost:3000/api/v1";

class UserContainer extends React.Component {
  state = {
    user: null,
    userFeed: [],
    userNotifications: []
  };

  handleforceUserUpdate = () => {
    console.log("inside handleforceUpdate");
    let token = localStorage.getItem("token");
    if (token) {
      // Fetch user information
      fetch(baseUrl + "/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState({ user: data });
        })
        .catch(e => console.error(e));
      // Fetch user feed
      fetch("http://localhost:3000/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(userFeed => {
          console.log("userFeed", userFeed);
          this.setState({ userFeed: userFeed });
        })
        .catch(e => console.error(e));

      // Fetch user notifications
      fetch("http://localhost:3000/notification_user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(userNotifications => {
          console.log("userNotifications", userNotifications);
          this.setState({ userNotifications: userNotifications });
        })
        .catch(e => console.error(e));
    }
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    if (token) {
      // Fetch user information
      fetch(baseUrl + "/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState({ user: data });
        })
        .catch(e => console.error(e));
      // Fetch user feed
      fetch("http://localhost:3000/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(userFeed => {
          console.log("userFeed", userFeed);
          this.setState({ userFeed: userFeed });
        })
        .catch(e => console.error(e));

      // Fetch user notifications
      fetch("http://localhost:3000/notification_user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(userNotifications => {
          console.log("userNotifications", userNotifications);
          this.setState({ userNotifications: userNotifications });
        })
        .catch(e => console.error(e));

      // Fetch user feed from actioncable
      // fetch(`${API_ROOT}/me`)
      //   .then(res => res.json())
      //   .then(userFeed => this.setState({ userFeed }));
    }
  }

  handleReceivedUserFeed = response => {
    // const { userFeed } = response;
    this.setState({
      userFeed: [...this.state.userFeed, response]
    });
  };

  render() {
    return (
      <div>
        {/* <ActionCable
          channel={{ channel: "UserChannel" }}
          onReceived={this.handleReceivedUserFeed}
        /> */}
        <Route
          path="/"
          render={routerProps => <UserMenu user={this.state.user} />}
        />

        {this.state.user ? (
          <Route
            exact
            path="/"
            render={routerProps => (
              <Segment>
                <UserDashboard user={this.state.user} />
                <UserFeed userFeed={this.state.userFeed} />
              </Segment>
            )}
          />
        ) : (
          <p>Loading...</p>
        )}
        {this.state.user ? (
          <Route
            exact
            path="/group_dashboard"
            render={routerProps => (
              <GroupDashboard
                user={this.state.user}
                handleForceUpdate={this.handleforceUpdate}
              />
            )}
          />
        ) : (
          <p>Loading...</p>
        )}

        {this.state.user ? (
          <Route
            exact
            path="/sessions_and_games"
            render={routerProps => <SessionsDashboard user={this.state.user} />}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default UserContainer;
