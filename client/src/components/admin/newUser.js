import React, { Component } from "react";
import Employees from "../employees/employees"

class AdminConsole extends Component {
    constructor(props) {
      super(props);
      this.state = {//store values in state and use for auth
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userClass: '',
        msg: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    //input validator, returns an object with two members, error and isValid
    isValidInput = (email, password, permissions) => {
        var res = true;     
        var errors = {};
        if(email.length === 0){
            res = false;
            errors.email = 'Valid email is required'
        }
        if(password.length === 0){
            res = false;
            errors.password = 'Password is required'
        }
        if(permissions.length === 0){
            res = false;
            errors.password = 'User class is required'
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
        const {email, password, firstName, lastName, userClass} = this.state
        var {errors, isValid} = this.isValidInput(email, password, userClass)
        if(!isValid){//if the input is invalid, set the errors state with the error object returned from isValidInput
            this.setState({errors});
            return;
        }
        //valid input
        this.setState({msg:''})
        let self = this;
        fetch('/admin/addUser',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user': email,
                'password': password,
                'firstName': firstName,
                'lastName': lastName,
                'userClass': userClass
            })
        })
        .then(res => {
            return res.text()
        })
        .then(
            function(data){
                //can't use 'this' here due to context loss in promise
                self.setState({'msg': data})
            }
        )
    }
  
    render(){
        return(
            <div>
                <Employees/>
                <br></br>
                <div>       
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group col-md-6">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label>Email</label>
                                    <input type="email" name="email" class="form-control" id="inputEmail4" placeholder="Email" 
                                    value={this.state.email} onChange={this.handleChange}/>
                                </div>
                                <div class="form-group col-md-6">
                                    <label>Password</label>
                                    <input type="password" name="password" class="form-control" id="inputPassword4" placeholder="Password" 
                                    value={this.state.password} onChange={this.handleChange}/>
                                </div>
                            </div>
                        </div>
                        <div class="form-group col-md-6">
                            <label>First Name</label>
                            <input type="text" name="firstName" class="form-control" id="inputFname" placeholder="First Name"
                            value={this.state.firstName} onChange={this.handleChange}/>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Last name</label>
                            <input type="text" name = "lastName" class="form-control" id="inputLname" placeholder="Last Name"
                            value={this.state.lastName} onChange={this.handleChange}/>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Permissions</label>
                            <select id="inputClass" name="userClass" class="form-control"
                            value={this.state.userClass} onChange={this.handleChange}>
                                <option selected>Choose...</option>
                                <option>sales</option>
                                <option>supervisor</option>
                                <option>administrator</option>
                            </select>
                        </div>
                        <button>Create</button>
                    </form>
                    <div>{this.state.msg}</div>
                </div>
            </div> 
        );
    }
}

export default AdminConsole;