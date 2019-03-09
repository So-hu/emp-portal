import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import store from "../../store/store";
//emp-portal\client\src\store\store.js

const initialState = {
    id: "",
    firstName: "",
    lastName: "",
    email: "", 
    companyName: "",
    password: "", 
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    companyNameError: "", 
    passwordError: ""
}

class Barchart extends Component{

    state = { 
        awards: [],
        initialState
    }

	componentDidMount() {
        //console.log(store.getState().userData.userClass);

        if (store.getState().userData.userClass === "administrator"){
            fetch('/user/top5employess?id=' + "")
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
                   fetch('/user/top5employess?id=' + this.state.id)
                   .then(res => res.json())
                   .then(awards => this.setState({ awards }));
            }).catch(error => {
              console.log(error);
            });
            

        }
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