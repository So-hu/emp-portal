import React, { Component } from 'react';
import { Chart } from "react-google-charts";
 
class Piechart extends Component{

	state = { awards: [] }

	componentDidMount() {
		fetch('/user/awardsgiven')
		.then(res => res.json())
		.then(awards => this.setState({ awards }));
	}

  render(){

    return(
      <div className="Piechart">
      <Chart
		  width={'600px'}
		  height={'400px'}
		  chartType="PieChart"
		  loader={<div>Loading Chart</div>}
		  data={[
		    ['Awards Given', 'Number of Awards'],
		    ['Employee of the Month', this.state.awards.eom],
				['Employee of the Week', this.state.awards.eow],
				['Highest Sales in a Month', this.state.awards.hsm]
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