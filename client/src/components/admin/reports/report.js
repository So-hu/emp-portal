import React, { Component } from "react";
import ReportOptions from "./reportOptions";

class Report extends Component {
  state = {
    type: this.props.reportType
  };
  render() {
    return (
      <div className="report">
        <div className="row">
          <div className="col">
            <p>Chart here!</p>
          </div>
          <div className="col">
            <div className="row">
              <h1>Data Table</h1>
            </div>
            <div className="row">
              <ReportOptions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Report;
