//use this page to build all awards table from db
import React, { Component } from "react";

//ajax via react using states
class AllAwards extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      awards: []
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
    fetch("/allAwards") //uses the proxy to send request to server for data
      .then(res => res.json())
      .then(
        awards =>
          this.setState({ isLoaded: true, awards }, () =>
            console.log("All awards fetched..", awards)
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
              <th>Award Type ID</th>
              <th>Month</th>
              <th>Day</th>
              <th>Year</th>
              <th>First Name</th>
              <th>Creator ID</th>
            </tr>
          </thead>
          <tbody>
            {this.state.awards.map(awards => (
              <tr>
                <td>{awards.awardTypeID}</td>
                <td>{awards.month}</td>
                <td>{awards.date}</td>
                <td>{awards.year}</td>
                <td>{awards.firstName}</td>
                <td>{awards.creatorID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AllAwards;
