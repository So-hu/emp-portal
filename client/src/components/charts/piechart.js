import React, { Component } from 'react';
import { Chart } from "react-google-charts";
 
class Piechart extends Component{
  render(){
    return(
      <div className="chart">
      <Chart
		  width={'1000px'}
		  height={'1000px'}
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
		    pieHole: 0.6,
		  }}
		  rootProps={{ 'data-testid': '3' }}
		/>
      </div>
    )
  }
}

export default Piechart;