import React, { Component } from "react";
import Chart from "react-google-charts";
import { NavLink } from "react-router-dom";

class SmallReport extends Component {
  state = {
    target: this.props.target,
    getData: this.props.getData
  };

  componentDidMount() {
    this.state.getData("/report/" + this.state.target);
  }

  render() {
    return (
      <div className="smallReport">
        <div className="row">
          <div className="col-10">
            <Chart
              width={"600px"}
              height={"400px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={this.props.data.chartData}
              options={{
                title: this.props.data.chartTitle,
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Number of Awards",
                  minValue: 0
                }
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </div>
          <div className="col-2">
            <NavLink
              to={"/fullreport/" + this.state.target}
              className="btn btn-secondary"
            >
              Full Report
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
