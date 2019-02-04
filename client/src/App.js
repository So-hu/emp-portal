import React, { Component } from "react";
import "./App.css";
import Employees from "./components/employees/employees";
import LogOutPage from "./components/LogOutPage";
import Login from "./pages/login";
import Navbar from "./components/navbar/navbar";
import Piechart from "./components/charts/piechart"
import { BrowserRouter as Router, Redirect} from "react-router-dom";
import Route from "react-router-dom/Route";
import store from "./store/store";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      routes:[]
    };

    store.subscribe(() =>{
        this.setState({
          loggedIn: store.getState().authenticated
        })
        if(store.getState().userClass === "user"){
          this.setState({
            routes:[{ route: "/homepage", name: "Home" }, { route: "/employees", name: "Employees" }]
          })
        }
        else if(store.getState().userClass === "administrator"){
          this.setState({
            routes: [{ route: "/homepage", name: "Home" }, { route: "/admin", name: "Admin Console"}]
          })
        }
        else{
          this.setState({
            routes: []
          })
        }
      }
    )
  }

  render() {
    return (
      <div>
      <Router>
        <div>
          <Navbar routes = {this.state.routes}/>
          <Route path="/" exact strict component={Login}/>
          {this.state.loggedIn ?
            <Route path="/employees" strict component={Employees}/>
            : <Redirect to='/'/>
          }
          {this.state.loggedIn ?
            <Route
            path="/homepage"
            exact
            strict
            render={() => {
              return (
                <div>
                  <h2>Landing page</h2>
                  <Piechart />
                </div>
              );
            }}
            />
            : <Redirect to='/'/>
          }
          <Route path="/logout" strict component={LogOutPage}/>
        </div>
      </Router>
      </div>
    );
  }
}

export default App;
