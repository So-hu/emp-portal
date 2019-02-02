import React, { Component } from "react";
import { Redirect } from 'react-router'

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {//store values in state and use for auth
        user: '',
        password: '',
        errors: {},
        redirect: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    //input validator, returns an object with two members, error and isValid
    isValidInput = (user, password) => {
        var res = true;     
        var errors = {};
        if(user.length === 0){
            res = false;
            errors.user = 'Username field is required'
        }
        if(password.length === 0){
            res = false;
            errors.password = 'Password is required'
        }
        return {errors, isValid: res}
    }

    //when any field in the form is changed, update the state to reflect the new values
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        var valid = false
        const {user, password} = this.state;
        var {errors, isValid } = this.isValidInput(user, password);
        console.log(isValid)
        if(!isValid){//if the input is invalid, set the errors state with the error object returned from isValidInput
            this.setState({errors});
            return;
        }
        //valid input, proceed with server call.
        this.setState({errors: {}})
        console.log('verified, calling server')
        fetch('/userAuth',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user': user,
                'password': password,
            })
        })
        .then(res => res.json())
        .then(
            data => this.setState({'redirect': data.valid, 'errors': {login: data.msg}}),
            error => {this.setState({errors: error})}
        )
    }
    
    render(){
        const { user, password, errors, redirect } = this.state;
        
        if(redirect === true){
            window.location = "http://localhost:3000/employees"
        }

        return(
            <form onSubmit={this.handleSubmit}>
            <div className="alert alert-danger">{errors.login}</div>
                <label>Username</label>
                    <input 
                        name= "user"
                        placeholder = "Email Address" 
                        type="text" 
                        value = {this.state.user} 
                        onChange={this.handleChange}
                    />
                <br></br>
                <div className="alert alert-danger">{errors.user}</div>
                <label>Password</label>
                    <input 
                        name = "password"
                        placeholder = "Enter Password" 
                        type="password" 
                        value = {this.state.password} 
                        onChange={this.handleChange}
                    />
                <br></br>
                <div className="alert alert-danger">{errors.password}</div>
                <button>Login</button>
            </form>
        );
    }
}

export default Login;