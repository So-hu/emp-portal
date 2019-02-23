import React, { Component } from "react";
import Chart from "react-google-charts";

class Report extends Component {
  state = {
    target: this.props.target,
    getData: this.props.getData
  };

  componentDidMount() {
    this.state.getData("/report/" + this.state.target);
  }

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
      <div className="report">
        <div className="row">
          <div className="col">
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
                  title: this.props.data.chartHTitle,
                  minValue: 0
                }
              }}
            />
          </div>
          <div className="col">
            <div className="row">
              <h1>Data Table</h1>
            </div>
            <div className="row" />
          </div>
        </div>
      </div>
    );
  }
}

export default Report;
