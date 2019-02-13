//use this page to build employee table from db
import React, { Component } from "react";
import "./employees.css";

//ajax via react using states
class Employees extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      employees: []
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
    fetch("/employeeData") //uses the proxy to send request to server for data
      .then(res => res.json())
      .then(
        employees =>
          this.setState({ isLoaded: true, employees }, () =>
            console.log("Employees fetched..", employees)
          ),
        error => {
          this.setState({ isLoaded: true, error });
        }
      );
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading.....</div>;
    }
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {this.state.employees.map(employees => (
              <tr>
                <td>{employees.lastName}</td>
                <td>{employees.firstName}</td>
                <td>{employees.email}</td>
                <td>{employees.accountCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Employees;
