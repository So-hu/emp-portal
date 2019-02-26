import React, { Component } from "react";
import Barchart from "../charts/barchart";
import ReportOptions from "../admin/reportOptions";

class Report extends Component {
  state = {
    type: this.props.reportType
  };
  render() {
    return (
      <div className="report">
        <div className="row">
          <div className="col">
            <Barchart />
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
