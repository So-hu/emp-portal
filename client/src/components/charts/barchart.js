import React, { Component } from 'react';
import { Chart } from "react-google-charts";

class Barchart extends Component{

    state = { awards: [] }

	componentDidMount() {
		fetch('/user/top5employess')
		.then(res => res.json())
		.then(awards => this.setState({ awards }));
	}

    render(){
        return(
            <div className="Barchart">
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="BarChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['', 'Number of Awards'],
                        [this.state.awards.employee1, this.state.awards.emp1Awards],
                        [this.state.awards.employee2, this.state.awards.emp2Awards],
                        [this.state.awards.employee3, this.state.awards.emp3Awards],
                        [this.state.awards.employee4, this.state.awards.emp4Awards],
                        [this.state.awards.employee5, this.state.awards.emp5Awards]
                    ]}
                    options={{
                        title: 'Top 5 Employees',
                        chartArea: { width: '50%' },
                        hAxis: {
                        title: 'Number of Awards',
                        minValue: 0,
                        },
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>
        )
    }
}

export default Barchart;