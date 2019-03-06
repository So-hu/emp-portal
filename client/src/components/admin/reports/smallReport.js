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

  openDownloadWindow = url => {
    console.log(url);
    window.open(url);
  };

  getDownload = () => {
    var getDownLoadUrl = "/testGetDownloadUrl?report=" + this.props.target;
    fetch(getDownLoadUrl)
      .then(res => res.json())
      .then(url => this.openDownloadWindow(url));
  };

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
                  title: this.props.data.chartHTitle
                }
              }}
            />
          </div>
          <div className="col-6">
            <button onClick={this.getDownload} className="btn btn-secondary">
              Download
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
