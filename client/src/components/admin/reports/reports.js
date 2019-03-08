import React, { Component } from "react";
import SmallReport from "./smallReport";

class Reports extends Component {
  state = {
    data1: [],
    data2: [],
    data3: [],
    data4: [],
    dataError: {}
  };

  getData1 = target => {
    fetch(target)
      .then(res => res.json())
      .then(
        response =>
          this.setState({ data1: response }, () =>
            console.log("Data fetched..", response)
          ),
        error => {
          this.setState({ dataError: error });
        }
      );
  };

  getData2 = target => {
    fetch(target)
      .then(res => res.json())
      .then(
        response =>
          this.setState({ data2: response }, () =>
            console.log("Data fetched..", response)
          ),
        error => {
          this.setState({ dataError: error });
        }
      );
  };

  getData3 = target => {
    fetch(target)
      .then(res => res.json())
      .then(
        response =>
          this.setState({ data3: response }, () =>
            console.log("Data fetched..", response)
          ),
        error => {
          this.setState({ dataError: error });
        }
      );
  };

  getData4 = target => {
    fetch(target)
      .then(res => res.json())
      .then(
        response =>
          this.setState({ data4: response }, () =>
            console.log("Data fetched..", response)
          ),
        error => {
          this.setState({ dataError: error });
        }
      );
  };

  render() {
    return (
      <div className="reportsPage container-fluid">
        <h1>Default Reports</h1>
        <div className="row">
          <div className="col">
            <div className="row">
              <SmallReport
                data={this.state.data1}
                type="BarChart"
                target="topRecipients"
                getData={this.getData1}
              />
            </div>
            <div className="row">
              <SmallReport
                data={this.state.data2}
                type="BarChart"
                target="topGivers"
                getData={this.getData2}
              />
            </div>
          </div>
          <div className="col">
            <div className="row">
              <SmallReport
                data={this.state.data3}
                type="ColumnChart"
                target="awardsByMonth"
                getData={this.getData3}
              />
            </div>
            <div className="row">
              <SmallReport
                data={this.state.data4}
                type="ColumnChart"
                target="awardsByYear"
                getData={this.getData4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
