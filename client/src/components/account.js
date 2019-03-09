import React, { Component } from "react";
import "./awards/newAward.css";
import store from "../store/store";

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

class UserAccount extends Component {

    state = {
        initialState,
        userSettings: []
      };

    componentDidMount() {
        //console.log(store.getState().userName);
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
            }).catch(error => {
              console.log(error);
            });
      }

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

        if (!this.state.firstName){
            firstNameError = "first name should not be empty!";
        }

        if (!this.state.lastName){
            lastNameError = "last name should not be empty!";
        }

        if (!this.state.email.includes('@')){
            emailError = "invalid email!";
        }
        //not sure if title was needed in the award
        //if (!this.state.companyName){
            //companyNameError = "company name should not be empty!";
        //}

        //if (!this.state.password){
            //passwordError = "password should not be empty!";
        //}

        if(emailError || firstNameError || lastNameError || companyNameError || passwordError){
            this.setState({emailError, firstNameError, lastNameError, companyNameError, passwordError});
            return false;
        }

        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const isValid = this.validate();
        if (isValid){
            //valid input
            fetch("/user/account", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },

                body: JSON.stringify({
                id: this.state.id,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password
                })
            }).then(res => {
                return res.text();
            });

            console.log(this.state);

            //clear form
            this.setState(initialState);
        }
    }

    render(){
        return ( 
            <div class="form-style-6">
                <h1>Account Settings</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.firstNameError}
                        </div>
                        <input type="text" name="firstName" placeholder="First Name" value={this.state.firstName} 
                            onChange={this.handleChange} 
                        />
                    </div>
                    <div>
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.lastNameError}
                        </div>
                        <input type="text" name="lastName" placeholder="Last Name" value={this.state.lastName} 
                            onChange={this.handleChange} 
                        />
                    </div>
                    <div>
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.emailError}
                        </div>
                        <input type="email" name="email" placeHolder="email" value={this.state.email} 
                            onChange={this.handleChange} 
                            readonly="readonly"/>
                    </div>
                    <div>
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.passwordError}
                        </div>
                        <input type="password" name="password" placeHolder="Password" value={this.state.password} 
                            onChange={this.handleChange} 
                        />
                    </div>
                    <div>
                        <input type="submit" value="Update Profile"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserAccount;