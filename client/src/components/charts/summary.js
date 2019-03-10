import React, { Component } from "react";
import "./charts.css";
import store from "../../store/store";

class Summary extends Component{

    state = { awards: [] }

	componentDidMount() {
        if (store.getState().userData.userClass === "administrator"){
		    fetch('/user/summary?id=' + "")
		    .then(res => res.json())
            .then(awards => this.setState({ awards }));
        }
        else{
            let userAccountSettings = [];
        fetch('/user/account?email=' + store.getState().userName)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //TODO: Need to add company name into the database
                userAccountSettings = data.map((user) => { return {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }})
                this.setState({userSettings: userAccountSettings});
                this.setState({ 
                    id: this.state.userSettings[0].id,
                    firstName: this.state.userSettings[0].firstName, 
                    lastName: this.state.userSettings[0].lastName,
                    email: this.state.userSettings[0].email,
                   });
                   //console.log("id sent " + this.state.id);
                   fetch('/user/summary?id=' + this.state.id)
                   .then(res => res.json())
                   .then(awards => this.setState({ awards }));
            }).catch(error => {
              console.log(error);
            });
        }
	}

    render(){
        //console.log("this " + this.state.awards);
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