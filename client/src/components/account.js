import React, { Component } from "react";

const initialState = {
    firstName: "",
    lastName: "",
    email: "", 
    companyName: "",
    title: "",
    password: "", 
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    companyNameError: "", 
    passwordError: "",
    titleError: ""
}

class UserAccount extends Component {

    state = initialState;

    handleChange = (event) => {
        console.log(event.target.name);
        this.setState({[event.target.name]: event.target.value});
    }

    validate = () => {
        let firstNameError = "";
        let lastNameError = "";
        let emailError = "";
        let companyNameError = "";
        let passwordError = "";
        let titleError = "";

        if (!this.state.firstName){
            firstNameError = "first name should not be empty!";
        }

        if (!this.state.lastName){
            lastNameError = "last name should not be empty!";
        }

        if (!this.state.email.includes('@')){
            emailError = "invalid email!";
        }

        if (!this.state.companyName){
            companyNameError = "company name should not be empty!";
        }

        if (!this.state.password){
            passwordError = "password should not be empty!";
        }

        if (!this.state.title){
            titleError = "title should not be empty!";
        }

        if(emailError || firstNameError || lastNameError || companyNameError || titleError || passwordError){
            this.setState({emailError, firstNameError, lastNameError, companyNameError, titleError, passwordError});
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
                <div>
                    <label>
                        First Name:
                        <input name="firstName" placeholder="First Name" value={this.state.firstName} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.firstNameError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Last Name:
                        <input name="lastName" placeholder="Last Name" value={this.state.lastName} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.lastNameError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input name="email" placeHolder="email" value={this.state.email} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.emailError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Title:
                        <input name="title" placeHolder="Mr. Mrs. Ms." value={this.state.title} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.titleError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Company Name:
                        <input name="companyName" placeHolder=" " value={this.state.companyName} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.companyNameError}
                        </div>
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" placeHolder=" " value={this.state.password} 
                        onChange={this.handleChange} 
                        />
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.passwordError}
                        </div>
                    </label>
                </div>
                <div>
                    <button type="submit">Update Profile</button>
                </div>
            </form>
        )
    }
}

export default UserAccount;