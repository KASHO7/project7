import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Paper } from "@material-ui/core";
import TopBar from "./components/topBar/TopBar";
import UserList from "./components/userList/UserList";
import LoginRegister from './components/loginRegister/loginRegister';
import UserDetail from "./components/userDetail/UserDetail";
import UserPhotos from "./components/userPhotos/UserPhotos";
import axios from 'axios';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Home",
      isLoggedIn: false,
      current_user: null,
    };
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    axios.get("/admin/currentUser")
        .then(response => {
          const user = response.data.user;
          this.setState({ isLoggedIn: true, current_user: user });
        })
        .catch(err => {
          this.setState({ isLoggedIn: false, current_user: null });
        });
  }

  changeView = (newView, name) => {
    this.setState({ view: newView + (name ? name : "") });
  };

  changeLoggedIn = (newUser) => {
    this.setState({ current_user: newUser, isLoggedIn: true });
  };

  render() {
    return (
        <HashRouter>
          <div>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TopBar
                    view={this.state.view}
                    changeLoggedIn={this.changeLoggedIn}
                    current_user={this.state.current_user}
                />
              </Grid>
              <div className="main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  {this.state.isLoggedIn ? <UserList /> : null}
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Switch>
                    <Route
                        path="/login-register"
                        render={(props) => (
                            <LoginRegister
                                {...props}
                                changeLoggedIn={this.changeLoggedIn}
                            />
                        )}
                    />
                    {this.state.isLoggedIn ? (
                        <>
                          <Route
                              path="/users/:userId"
                              render={(props) => (
                                  <UserDetail {...props} changeView={this.changeView} />
                              )}
                          />
                          <Route
                              path="/photos/:userId"
                              render={(props) => (
                                  <UserPhotos changeView={this.changeView} {...props} />
                              )}
                          />
                        </>
                    ) : (
                        <>
                          <Redirect exact from="/" to="/login-register" />
                          <Redirect path="/users/:userId" to="/login-register" />
                          <Redirect path="/photos/:userId" to="/login-register" />
                        </>
                    )}
                  </Switch>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
