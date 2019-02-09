import React, { Component } from "react";

const initialState = {
    employeeFirstName: "",
    employeeLastName: "",
    employeeEmail: "", 
    sendDate: "",
    sendTime: "",
    awardClass: "month", 
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    dateError: "",
    timeError: ""
}

class CreateAwardForm extends Component {

    state = initialState;

    handleChange = (event) => {
        console.log(event.target.name);
        this.setState({[event.target.name]: event.target.value});
    }

    validate = () => {
        let firstNameError = "";
        let lastNameError = "";
        let emailError = "";

        if (!this.state.employeeFirstName){
            firstNameError = "first name should not be empty!";
        }

        if (!this.state.employeeLastName){
            lastNameError = "last name should not be empty!";
        }

        if (!this.state.employeeEmail.includes('@')){
            emailError = "invalid email!";
        }

        if(emailError || firstNameError || lastNameError){
            this.setState({emailError, firstNameError, lastNameError});
            return false;
        }

        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid){
            console.log(this.state);

            //clear form
            this.setState(initialState);
        }
    }

    render(){
        return ( 
            <form onSubmit={this.handleSubmit}>
                <h5>Create an Award</h5>
                <div>
                    <label>
                        Employee's First Name:
                        <input name="employeeFirstName" placeholder="First Name" value={this.state.employeeFirstName} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.firstNameError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Employee's Last Name:
                        <input name="employeeLastName" placeholder="Last Name" value={this.state.employeeLastName} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.lastNameError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Employee's Email:
                        <input name="employeeEmail" placeHolder="email" value={this.state.employeeEmail} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.emailError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Award Class:
                        <select name="awardClass" value={this.state.awardClass} onChange={this.handleChange}>
                            <option value="month">Employee of the Month</option>
                            <option value="week">Employee of the Week</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Send Date (MM/DD/YYYY):
                        <input type="date" name="sendDate" value={this.state.sendDate} onChange={this.handleChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        Send Time (HH:MM AM/PM):
                        <input type="time" name="sendTime" value={this.state.sendTime} onChange={this.handleChange}/>
                    </label>
                </div>
                <div>
                    <button type="submit">Create Award</button>
                </div>
            </form>
        )
    }
}

export default CreateAwardForm;