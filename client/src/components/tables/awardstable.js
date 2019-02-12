import React, { Component } from 'react';
import './awardstable.css';

class Awardstable extends Component {

  render(){
    // Data
    var dataColumns = ["ID", "Name", "Award Class"];
    var dataRows = [
      {
        ID: 1,
        Name: "David Smith",
        "Award Class": "Employee of the Month"
      },
      {
        ID: 2,
        Name: "Adrian Romero",
        "Award Class": "Employee of the Week"
      },
      {
        ID: 3,
        Name: "Ashley Mack",
        "Award Class": "Employee of the Week"
      },
      {
        ID: 4,
        Name: "Ally Hsu",
        "Award Class": "Employee of the Month"
      },
      {
        ID: 5,
        Name: "Edwin Rubio",
        "Award Class": "Employee of the Month"
      }
    ];

    var tableHeaders = (<thead>
          <tr>
            {dataColumns.map(function(column) {
              return <th>{column}</th>; })}
          </tr>
      </thead>);

    var tableBody = dataRows.map(function(row) {
      return (
        <tr>
          {dataColumns.map(function(column) {
            return <td>{row[column]}</td>; })}
        </tr>); 
    });
     
    // Decorate with Bootstrap CSS
    return (
      <table className="table ">
        {tableHeaders}
        {tableBody}
      </table>
    )
  }
}

export default Awardstable;