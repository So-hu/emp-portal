import React, { Component } from "react";
import "./awards/newAward.css";

const initialState = {
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
        let userAccountSettings = [];
        //TODO: Need to somehow determine who is logged in to get data. Currently is set to get Jared Goff profile.
        fetch('/user/account?id=' + 2)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //TODO: Need to add company name into the database
                userAccountSettings = data.map((user) => { return {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password}})
                this.setState({userSettings: userAccountSettings});
                console.log("This is the client account page: " + this.state.userSettings[0].password);
                this.setState({ 
                    firstName: this.state.userSettings[0].firstName, 
                    lastName: this.state.userSettings[0].lastName,
                    email: this.state.userSettings[0].email,
                    password: this.state.userSettings[0].password,
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

        if (!this.state.companyName){
            companyNameError = "company name should not be empty!";
        }

        if (!this.state.password){
            passwordError = "password should not be empty!";
        }

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
            //TODO: Need to somehow see how i can get what user is logged in. Currently is just updateing Jared Goff accoungt.
            //valid input
            fetch("/user/account", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },

                body: JSON.stringify({
                id: 2,
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
                        />
                    </div>
                    <div>
                        <div style={{color: "red", fontSize: 12}}>
                            {this.state.companyNameError}
                        </div>
                        <input type="text" name="companyName" placeHolder="Company Name" value={this.state.companyName} 
                            onChange={this.handleChange} 
                        />
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