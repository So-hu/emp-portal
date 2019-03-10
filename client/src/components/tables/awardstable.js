import React, { Component } from "react";
import "./awardstable.css";
import store from "../../store/store";

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
    if (store.getState().userData.userClass === "administrator"){
      fetch("/user/awardsData?id=" + "") //uses the proxy to send request to server for data
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
      else{
        let userAccountSettings = [];
        fetch('/user/account?email=' + store.getState().userName)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //TODO: Need to add company name into the database
                userAccountSettings = data.map((user) => { return {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }})
                this.setState({userSettings: userAccountSettings});
                this.setState({ 
                    id: this.state.userSettings[0].id,
                    firstName: this.state.userSettings[0].firstName, 
                    lastName: this.state.userSettings[0].lastName,
                    email: this.state.userSettings[0].email,
                   });
                   //console.log("id sent " + this.state.id);
                   fetch('/user/awardsData?id=' + this.state.id)
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
            }).catch(error => {
              console.log(error);
            });
      }
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
