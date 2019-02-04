import React, { Component } from 'react';
import './awardstable.css';

class Awardstable extends Component {

  render(){
    // Data
    var dataColumns = this.props.columns;
    var dataRows = this.props.rows;

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
      <table className="table table-bordered table-hover infoContainer" width="10%">
        {tableHeaders}
        {tableBody}
      </table>
    )
  }
}

export default Awardstable;