import React, { Component } from 'react';
import { Chart } from "react-google-charts";

class Barchart extends Component{
    render(){
        return(
            <div className="Barchart">
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="BarChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['', 'Employee of the Month', 'Employee of the Week'],
                        ['Sam', 81, 80],
                        ['Carlos', 37, 36],
                        ['David', 26, 28],
                        ['Sarah', 20, 19],
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