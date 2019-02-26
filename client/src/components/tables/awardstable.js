import React, { Component } from "react";
import "./awardstable.css";

class Awardstable extends Component {
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
    fetch("/user/awardsData") //uses the proxy to send request to server for data
      .then(res => res.json())
      .then(
        awards =>
          this.setState({ isLoaded: true, awards }, () =>
            console.log("Awards fetched..", awards)
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
        <h6>Last 5 Awards Created</h6>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Awarded To</th>
            </tr>
          </thead>
          <tbody>
            {this.state.awards.map(awards => (
              <tr>
                <td>{awards.date}</td>
                <td>{awards.type}</td>
                <td>
                  {awards.recipientFirst} {awards.recipientLast}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Awardstable;
