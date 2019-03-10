import React, { Component } from "react";
import store from "../store/store";
import { logIn } from "../store/actions";
import { Redirect } from "react-router-dom";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //store values in state and use for auth
      user: "",
      password: "",
      userClass: "",
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
    if (user.length === 0) {
      res = false;
      errors.user = "Username field is required";
    }
    if (password.length === 0) {
      res = false;
      errors.password = "Password is required";
    }
    return { errors, isValid: res };
  };

  //when any field in the form is changed, update the state to reflect the new values
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { user, password } = this.state;
    var { errors, isValid } = this.isValidInput(user, password);
    if (!isValid) {
      //if the input is invalid, set the errors state with the error object returned from isValidInput
      this.setState({ errors });
      return;
    }
    //valid input, proceed with server call.
    this.setState({ errors: {} });
    //save the context for later use
    let self = this;
    fetch("/userAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user,
        password: password
      })
    })
      .then(res => {
        return res.json();
      })
      .then(function(data) {
        //can't use 'this' here due to context loss in promise
        self.setState({
          redirect: data.valid,
          userClass: data.user.userClass,
          errors: { login: data.msg }
        });
        if (data.valid === true) {
          store.dispatch(logIn(user, data.user));
        }
      });
  };

  login = () => {
    store.dispatch(logIn());
  };

  render() {
    const { errors } = this.state;
    if (this.state.redirect === true) {
      return <Redirect to="/homepage" />;
    }

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <div>{errors.login}</div>
          <label className="label">Username</label>
          <br />
          <input
            name="user"
            placeholder="Email Address"
            type="text"
            className="form-control"
            value={this.state.user}
            onChange={this.handleChange}
          />
          <br />
          <div>{errors.user}</div>
          <label className="label">Password</label>
          <br />
          <input
            name="password"
            placeholder="Enter Password"
            type="password"
            className="form-control"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          <div>{errors.password}</div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
