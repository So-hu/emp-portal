import React, { Component } from "react";
import './newAward.css'

const initialState = {
    employeeFirstName: "",
    employeeLastName: "",
    employeeEmail: "", 
    sendDate: "",
    sendTime: "",
    awardClass: "", 
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    dateError: "",
    timeError: "", 
    awardError: ""
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
        let awardError = "";
        let dateError = "";
        let timeError = "";

        if (!this.state.employeeFirstName){
            firstNameError = "First name is required";
        }

        if (!this.state.employeeLastName){
            lastNameError = "Last name is required";
        }

        if (!this.state.employeeEmail.includes('@')){
            emailError = "Invalid email";
        }

        if (!this.state.awardClass){
            awardError = "Select award type";
        }

        if (!this.state.sendDate){
            dateError = "Enter a send date";
        }

        if (!this.state.sendTime){
            timeError = "Enter a send time";
        }

        if(emailError || firstNameError || lastNameError || awardError || dateError || timeError){
            this.setState({emailError, firstNameError, lastNameError, awardError, dateError, timeError});
            return false;
        }

        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid){
            console.log(this.state);

            //valid input
            fetch("/user/addAward", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                awardTypeID: this.state.awardClass,
                month: this.state.sendDate,
                date: this.state.sendDate,
                year: this.state.sendDate,
                time: this.state.sendTime,
                firstName: this.state.employeeFirstName
              })
            })

            .then(res => {
                return res.text();
              })

            //clear form
            this.setState(initialState);
        }
    }

    render(){
        return ( 
            <div class="form-style-6">
            <h1>Create a New Award</h1>
            <form onSubmit={this.handleSubmit}>
                    <div style={{color: "red"}}>
                        {this.state.firstNameError}
                    </div>
                <input type="text" name="employeeFirstName" placeholder="First Name" value={this.state.employeeFirstName} onChange={this.handleChange} />
                    <div style={{color: "red"}}>
                        {this.state.lastNameError}
                    </div>
                <input type="text" name="employeeLastName" placeholder="Last Name" value={this.state.employeeLastName} onChange={this.handleChange} />
                    <div style={{color: "red"}}>
                        {this.state.emailError}
                    </div>
                <input type="email" name="employeeEmail" placeHolder="Email" value={this.state.employeeEmail} onChange={this.handleChange} />
                    <div style={{color: "red"}}>
                            {this.state.awardError}
                    </div>
                <select name="awardClass" value={this.state.awardClass} onChange={this.handleChange}>
                            <option value="" disabled selected>Select Award Type</option>
                            <option value="1">Employee of the Month</option>
                            <option value="2">Employee of the Week</option>
                </select>
                    <div style={{color: "red"}}>
                            {this.state.dateError}
                    </div>
                    Send Date (mm/dd/yyyy):
                <input type="date" name="sendDate" value={this.state.sendDate} onChange={this.handleChange}/>
                    <div style={{color: "red"}}>
                            {this.state.timeError}
                    </div>
                    Send Time (hh:mm am/pm):
                <input type="time" name="sendTime" value={this.state.sendTime} onChange={this.handleChange}/>
                <input type="submit" value="Create Award"/>
            </form>
            </div>
        )
    }
}

export default CreateAwardForm;