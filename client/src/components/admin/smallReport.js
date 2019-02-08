import React, { Component } from "react";
import Barchart from "../charts/barchart";

class SmallReport extends Component {
  state = {};
  render() {
    return (
      <div className="smallReport">
        <div className="row">
          <div className="col-10">
            <Barchart />
          </div>
          <div className="col-2">
            <button className="btn btn-secondary">Full Report</button>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
