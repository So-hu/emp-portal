import React, { Component } from 'react';
import { Chart } from "react-google-charts";
 
class Piechart extends Component{
  render(){
    return(
      <div className="Piechart">
      <Chart
		  width={'600px'}
		  height={'400px'}
		  chartType="PieChart"
		  loader={<div>Loading Chart</div>}
		  data={[
		    ['Task', 'Hours per Day'],
		    ['Employee of the Month', 6],
		    ['Employee of the Week', 2],
		  ]}
		  options={{
		    title: 'Awards Given',
		    // Just add this option
		    pieHole: 0.5,
		  }}
		  rootProps={{ 'data-testid': '3' }}
		/>
      </div>
    )
  }
}

export default Piechart;