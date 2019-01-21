import React, { Component } from 'react';
import './App.css';
import Employees from './components/employees/employees';
import Login from './pages/login'
import {BrowserRouter as Router, NavLink} from 'react-router-dom';
import Route from 'react-router-dom/Route';

class App extends Component {
  constructor(props){
    super(props);
    //todo:initialized the authenticated state here. Will be passed to routes to track state
    this.state = {
      isAuthenticated: false
    };
  }

  //currently does nothing, some event will call this and pass it a result which will set the state
  authCompleted = isAuthenticated =>{
    this.setState({isAuthenticated: isAuthenticated});
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact strict render={
            () => { 
              return(
                <div className= "App">
                  <header className="App-header">
                    Login Component
                  </header>
                  <Login/>
                </div> 
              )
            }          
          }/>
          <Route path="/employees" exact strict render={
            () => { 
              return(
                <div>
                  <h2>Employee Tables</h2>
                  <Employees />
                </div>  
              )
            }          
          }/>
          <Route path="/homepage" exact strict render={
            () => { 
              return(
                <div>
                  <h2>Landing page</h2>
                </div>  
              )
            }          
          }/>
        </div>
      </Router>
    );
  }
}

export default App;
