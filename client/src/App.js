import React, { Component } from "react";
import "./App.css";
import Employees from "./components/employees/employees";
import LogOutPage from "./components/LogOutPage";
import Login from "./pages/login";
import Navbar from "./components/navbar/navbar";
import Piechart from "./components/charts/piechart";
import Barchart from "./components/charts/barchart";
import Awardstable from "./components/tables/awardstable";
import CreateAwardForm from "./components/awards/newAward";
import Summary from "./components/charts/summary";
import UserAccount from "./components/account";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import Route from "react-router-dom/Route";
import store from "./store/store";
import AdminConsole from "./components/admin/userAdministration";
import Reports from "./components/admin/reports";
import awardsHistory from "./components/awards/awardsHistory";
import Modal from "react-modal";

class App extends Component {
  constructor(props) {
    super(props);

    Modal.setAppElement("#root");

    this.state = {
      loggedIn: false,
      routes: []
    };

    store.subscribe(() => {
      this.setState({
        loggedIn: store.getState().authenticated
      });
      if (store.getState().userClass === "user") {
        this.setState({
          routes: [
            { route: "/homepage", name: "Home" },
            { route: "/newaward", name: "New Award" },
            { route: "/awardshistory", name: "Awards History" },
            { route: "/account", name: "Account" }
          ]
        });
      } else if (store.getState().userClass === "administrator") {
        this.setState({
          routes: [
            { route: "/homepage", name: "Home" },
            { route: "/user+administration", name: "User Administration" },
            { route: "/reports", name: "Reports" }
          ]
        });
      } else {
        this.setState({
          routes: []
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Navbar routes={this.state.routes} />
            <Route path="/" exact strict component={Login} />
            {this.state.loggedIn ? (
              <Route path="/employees" strict component={Employees} />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route
                path="/user+administration"
                strict
                component={AdminConsole}
              />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route path="/reports" strict component={Reports} />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route
                path="/homepage"
                exact
                strict
                render={() => {
                  return (
                    <div className="container-fluid ">
                      <div className="grid-container">
                        <div>
                          <Piechart />
                        </div>
                        <div>
                          <Barchart />
                        </div>
                        <div>
                          <Awardstable />
                        </div>
                        <div>
                          <Summary />
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route path="/newaward" strict component={CreateAwardForm} />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route path="/account" strict component={UserAccount} />
            ) : (
              <Redirect to="/" />
            )}
            {this.state.loggedIn ? (
              <Route path="/awardshistory" strict component={awardsHistory} />
            ) : (
              <Redirect to="/" />
            )}
            <Route path="/logout" strict component={LogOutPage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
