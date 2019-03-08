import React, { Component } from "react";

class CustomReport extends Component {
  state = {
    targets: [
      { displayName: "Awards", value: "awards" },
      { displayName: "Employees", value: "employees" }
    ],
    awardParams: [
      { displayName: "Recipient Name", value: "recipient" },
      { displayName: "Awarded By Name", value: "creator" }
    ],
    employeeParams: [{ displayName: "Name", value: "name" }],
    // Todo: make these award options populate from the server
    awardTypes: [
      { displayName: "Employee of the Month", value: 1 },
      { displayName: "Employee of the Year", value: 2 },
      { displayName: "Highest Sales in a Month", value: 3 }
    ],
    numericalComparators: [
      { displayName: "Greater than", value: ">" },
      { displayName: "Less than", value: "<" },
      { displayName: "Equal to", value: "=" }
    ],
    target: "",
    nameType: "", //recipient, creator
    name: "",
    awardType: "",
    startDate: "",
    endDate: "",
    awardComparator: "",
    awardComparisonValue: "",
    fileName: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  openDownloadWindow = url => {
    window.open(url);
  };

  getDownload = event => {
    event.preventDefault();
    const {
      target,
      nameType,
      name,
      awardType,
      startDate,
      endDate,
      awardComparator,
      awardComparisonValue,
      fileName
    } = this.state;
    fetch("/getQueryCsv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target,
        nameType,
        name,
        awardType,
        startDate,
        endDate,
        awardComparator,
        awardComparisonValue,
        fileName
      })
    })
      .then(res => res.json())
      .then(url => this.openDownloadWindow(url));
  };

  //Populate selects with different options depending on initial target selection
  getDependentNameParams = () => {
    if (this.state.target === "awards") {
      return this.state.awardParams.map(parameter => (
        <option value={parameter.value}>{parameter.displayName}</option>
      ));
    } else if (this.state.target === "employees") {
      return this.state.employeeParams.map(parameter => (
        <option value={parameter.value}>{parameter.displayName}</option>
      ));
    }
  };

  getDependentAdditionalOptions = () => {
    if (this.state.target === "awards") {
      return (
        <>
          <div className="form-group">
            <label>and award type equals</label>
            <select
              name="awardType"
              className="form-control"
              id="awardType"
              value={this.state.awardType}
              onChange={this.handleChange}
            >
              <option />
              {this.state.awardTypes.map(type => (
                <option value={type.value}>{type.displayName}</option>
              ))}
            </select>
          </div>
          <label>where date awarded is in the range</label>
          <div className="input-group">
            <input
              type="date"
              name="startDate"
              className="form-control"
              id="startDate"
              value={this.state.startDate}
              onChange={this.handleChange}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">to</span>
            </div>
            <input
              type="date"
              name="endDate"
              className="form-control"
              id="endDate"
              value={this.state.endDate}
              onChange={this.handleChange}
            />
          </div>
        </>
      );
    } else if (this.state.target === "employees") {
      return (
        <>
          <div className="form-group">
            <label>and awards received is</label>
            <select
              name="awardComparator"
              className="form-control"
              id="awardComparator"
              value={this.state.awardComparator}
              onChange={this.handleChange}
            >
              <option />
              {this.state.numericalComparators.map(c => (
                <option value={c.value}>{c.displayName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>the following amount</label>
            <input
              type="number"
              name="awardComparisonValue"
              className="form-control"
              id="awardComparisonValue"
              value={this.state.awardComparisonValue}
              onChange={this.handleChange}
            />
          </div>
        </>
      );
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <h2>Business Intelligence Report Exporter</h2>
        <p>
          Set the following parameters to construct a query and receive a .csv
          of the results.
        </p>
        <form onSubmit={this.getDownload}>
          <div className="form-group">
            <label>Export</label>
            <select
              required
              name="target"
              className="form-control"
              id="target"
              value={this.state.target}
              onChange={this.handleChange}
            >
              <option />
              {this.state.targets.map(target => (
                <option value={target.value}>{target.displayName}</option>
              ))}
            </select>
            <label>where</label>
            <select
              name="nameType"
              className="form-control"
              id="nameType"
              value={this.state.queryTable}
              onChange={this.handleChange}
            >
              <option value="" />
              {this.getDependentNameParams()}
            </select>
            <label>matches</label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={this.state.value}
              onChange={this.handleChange}
            />
            {this.getDependentAdditionalOptions()}
            <label>Desired filename</label>
            <input
              required
              type="text"
              name="fileName"
              className="form-control"
              id="fileName"
              value={this.state.fileName}
              onChange={this.handleChange}
            />
          </div>
          <button className="btn btn-primary">Get .csv</button>
        </form>
      </div>
    );
  }
}

export default CustomReport;
