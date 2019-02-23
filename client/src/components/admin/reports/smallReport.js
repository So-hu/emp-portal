import React, { Component } from "react";
import Chart from "react-google-charts";
import { NavLink } from "react-router-dom";

class SmallReport extends Component {
  state = {
    getData: this.props.getData
  };

  componentDidMount() {
    this.state.getData("/report/" + this.props.target);
  }

  render() {
    return (
      <div className="smallReport">
        <div className="row">
          <div className="col-6">
            <Chart
              width={"600px"}
              height={"400px"}
              chartType={this.props.type}
              loader={<div>Loading Chart</div>}
              data={this.props.data.chartData}
              options={{
                title: this.props.data.chartTitle,
                chartArea: { width: "50%" },
                hAxis: {
                  title: this.props.data.chartHTitle,
                  minValue: 0
                }
              }}
            />
          </div>
          <div className="col-6">
            <table className="" />
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
