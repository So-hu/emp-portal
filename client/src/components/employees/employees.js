//use this page to build employee table from db
import React, { Component } from 'react';
import './employees.css';

//ajax via react using states
class Employees extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      employees: []
    }
  }

  componentDidMount(){
    this.setState({ mounted: true })
    fetch('/employeeData') //uses the proxy to send request to server for data
      .then(res => res.json())
      .then(
        employees => this.setState({isLoaded: true, employees}, () => console.log('Employees fetched..', employees)),
        error => {
          this.setState({isLoaded:true, error});
        }
      );   
  }

  //placeholder function call for employee table
  doSomethingButton = () =>{
    console.log('The button did something');
    //todo:DELETE/POST/UPDATE functionality for admins
  }

  //todo:create award function and associated components

  render() {
    if(this.state.error){
      return <div>Error: {this.state.error.message}</div>;
    }
    else if(!this.state.isLoaded){
      return <div>Loading.....</div>;
    }
    return (
      <div>
        <header>
          This is employee component 
        </header>
          <ul>
            {this.state.employees.map(employees =>//renders data for every member of employee
              //bind react event listener to button, replace with needed action handler when implemented
              <li key = {employees.id}> {employees.name} <button onClick = {this.doSomethingButton}>Do something</button></li>
            )}
          </ul>
      </div>
    );
  }
}

export default Employees;