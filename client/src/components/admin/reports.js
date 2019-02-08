import React, { Component } from "react";
import Report from "./report";
import SmallReport from "./smallReport";
import CustomReport from "./customReport";

class Reports extends Component {
  state = {};

  componentDidMount() {
    //todo: fetch report data for default reports
  }

  render() {
    return (
      <div className="reportsPage container-fluid">
        <div className="row">
          <div className="col">
            <h1>Default Reports</h1>
            <div className="row">
              <SmallReport />
            </div>
            <div className="row">
              <SmallReport />
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
