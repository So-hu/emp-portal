import React, { Component } from "react";
import Report from "./report";
import SmallReport from "./smallReport";
import CustomReport from "./customReport";

class Reports extends Component {
  state = {
    data: [],
    dataIsLoaded: false,
    dataError: {}
  };

  getData = target => {
    fetch(target)
      .then(res => res.json())
      .then(
        response =>
          this.setState({ dataIsLoaded: true, data: response }, () =>
            console.log("Data fetched..", response)
          ),
        error => {
          this.setState({ dataIsLoaded: true, dataError: error });
        }
      );
  };

  render() {
    return (
      <div className="reportsPage container-fluid">
        <div className="row">
          <div className="col">
            <h1>Default Reports</h1>
            <div className="row">
              <SmallReport
                data={this.state.data}
                target="topRecipients"
                getData={this.getData}
              />
            </div>
            <div className="row">
              <p>placeholder</p>
            </div>
          </div>
          <div className="col">
            <CustomReport />
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
