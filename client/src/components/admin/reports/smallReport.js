import React, { Component } from "react";
import Chart from "react-google-charts";

class SmallReport extends Component {
  state = {
    getData: this.props.getData,
    title: this.props.title
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
        <div className="card">
          <h3 class="text-center card-header">{this.state.title}</h3>
          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {this.props.data.jsonData
                      ? this.props.data.jsonData.header.map(header => (
                          <th>{header}</th>
                        ))
                      : null}
                  </tr>
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
                    : null}
                </tbody>
              </table>
              <button onClick={this.getDownload} className="btn btn-secondary">
                Download .csv
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallReport;
