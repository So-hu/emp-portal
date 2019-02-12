import React, { Component } from "react";
import "./charts.css";

class Summary extends Component{
    render(){
        return(
            <div>
                <div>
                    <h5 align="center">Summary</h5>
                </div>
                <div className="grid-container">
                    <div align="center" >
                        <div margin="auto">
                            <h5>1,857</h5>
                        </div>
                        <div>
                            <h5>Total Employees</h5>
                        </div>
                    </div>
                    <div align="center">
                        <div>
                        <h5>56%</h5>
                        </div>
                        <div>
                            <h5>of employees have awards</h5>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Summary;