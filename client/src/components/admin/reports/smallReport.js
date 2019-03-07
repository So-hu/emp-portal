import React, { Component } from "react";
import Chart from "react-google-charts";

class SmallReport extends Component {
  state = {
    getData: this.props.getData
  };

  componentDidMount() {
    this.state.getData("/report/" + this.props.target);
  }

  openDownloadWindow = url => {
    window.open(url);
  };

  getDownload = () => {
    var getDownLoadUrl = "/getDownloadUrl?report=" + this.props.target;
    fetch(getDownLoadUrl)
      .then(res => res.json())
      .then(url => this.openDownloadWindow(url));
  };

  render() {
    return (
      <div className="container-fluid">
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
            <table class="table table-striped">
              <thead>
                {this.props.data.jsonData
                  ? this.props.data.jsonData.header.map(header => (
                      <th>{header}</th>
                    ))
                  : "Loading"}
              </thead>
              <tbody>
                {this.props.data.jsonData
                  ? this.props.data.jsonData.rows.map(row => (
                      <tr>
                        {row.map(item => (
                          <td>{item}</td>
                        ))}
                      </tr>
                    ))
                  : "Loading Data Table..."}
              </tbody>
            </table>
            <button onClick={this.getDownload} className="btn btn-secondary">
              Download .csv
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
