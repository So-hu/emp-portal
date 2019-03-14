//use this page to build employee table from db
import React, { Component } from "react";
import store from "../../store/store";

//ajax via react using states
class awardsHistory extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoaded: false,
      awards: [],
      msg: ""
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });

    let userAccountSettings = [];
    fetch("/user/account?email=" + store.getState().userName)
      .then(response => {
        return response.json();
      })
      .then(data => {
        //TODO: Need to add company name into the database
        userAccountSettings = data.map(user => {
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };
        });
        this.setState({ userSettings: userAccountSettings });
        this.setState({
          id: this.state.userSettings[0].id,
          firstName: this.state.userSettings[0].firstName,
          lastName: this.state.userSettings[0].lastName,
          email: this.state.userSettings[0].email
        });
        //console.log("id sent " + this.state.id);
        this.updateAwardsHistory();
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateAwardsHistory = () => {
    fetch("/awardsData?id=" + this.state.id) //uses the proxy to send request to server for data
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
  };

  handleAwardDelete = id => {
    console.log("Deleting award " + id);
    let self = this;
    fetch("/deleteAward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        awardId: id
      })
    })
      .then(res => {
        return res.text();
      })
      .then(function(data) {
        self.setState({ msg: data });
        self.updateAwardsHistory();
      });
  };

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
              <th>Time</th>
              <th>Type</th>
              <th>Awarded To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.awards.map(awards => (
              <tr>
                <td>{awards.date}</td>
                <td>{awards.time}</td>
                <td>{awards.type}</td>
                <td>
                  {awards.recipientFirst} {awards.recipientLast}
                </td>
                <td>
                  <button
                    onClick={() => this.handleAwardDelete(awards.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
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
