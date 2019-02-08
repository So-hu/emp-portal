import React, { Component } from "react";
import "./App.css";
import Employees from "./components/employees/employees";
import LogOutPage from "./components/LogOutPage";
import Login from "./pages/login";
import Navbar from "./components/navbar/navbar";
import Piechart from "./components/charts/piechart";
import Barchart from "./components/charts/barchart";
import Awardstable from "./components/tables/awardstable";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import Route from "react-router-dom/Route";
import store from "./store/store";
import AdminConsole from "./components/admin/newUser";
import Reports from "./components/admin/reports";

class App extends Component {
  constructor(props) {
    super(props);
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
            { route: "/employees", name: "Employees" }
          ]
        });
      } else if (store.getState().userClass === "administrator") {
        this.setState({
          routes: [
            { route: "/homepage", name: "Home" },
            { route: "/admin+console", name: "Admin Console" },
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
              <Route path="/admin+console" strict component={AdminConsole} />
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
                    <div className="container-fluid">
                      <h5>Dashboard</h5>
                      <div className="grid-container">
                        <div className="light-blue-border">
                          <Piechart />
                        </div>
                        <div className="light-blue-border">
                          <Barchart />
                        </div>
                        <div className="light-blue-border">
                          <Awardstable
                            columns={["ID", "Name", "Award Class"]}
                            rows={[
                              {
                                ID: 1,
                                Name: "David Smith",
                                "Award Class": "Employee of the Month"
                              },
                              {
                                ID: 2,
                                Name: "Adrian Romero",
                                "Award Class": "Employee of the Week"
                              },
                              {
                                ID: 3,
                                Name: "Ashley Mack",
                                "Award Class": "Employee of the Week"
                              },
                              {
                                ID: 4,
                                Name: "Ally Hsu",
                                "Award Class": "Employee of the Month"
                              },
                              {
                                ID: 5,
                                Name: "Edwin Rubio",
                                "Award Class": "Employee of the Month"
                              }
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
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
