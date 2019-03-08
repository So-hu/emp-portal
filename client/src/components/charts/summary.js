import React, { Component } from "react";
import "./charts.css";

class Summary extends Component{

    state = { awards: [] }

	componentDidMount() {
		fetch('/user/summary')
		.then(res => res.json())
		.then(awards => this.setState({ awards }));
	}

    render(){
        console.log("this " + this.state.awards);
        return(
            <div>
                <div>
                    <h6 align="center">Summary</h6>
                </div>
                <div className="grid-container">
                    <div align="center" >
                        <div margin="auto">
                            <h5>{this.state.awards.numEmployees}</h5>
                        </div>
                        <div>
                            <h5>Total Employees</h5>
                        </div>
                    </div>
                    <div align="center">
                        <div>
                        <h5>{this.state.awards.numberAwards}</h5>
                        </div>
                        <div>
                            <h5>Awards Given</h5>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Summary;