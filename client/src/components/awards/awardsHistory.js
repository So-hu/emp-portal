//use this page to build employee table from db
import React, { Component } from "react";

//ajax via react using states
class awardsHistory extends Component {
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
    fetch("/awardsData") //uses the proxy to send request to server for data
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
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Awarded To</th>
              <th>Awarded By</th>
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
                <td>
                  {awards.creatorFirst} {awards.creatorLast}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default awardsHistory;
