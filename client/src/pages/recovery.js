import React, { Component } from "react";
import store from "../store/store";
import { logIn } from "../store/actions";
import { NavLink } from 'react-router-dom'
import "./recovery.css";

class Recovery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //store values in state and use for auth
      email: "",
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //input validator, returns an object with two members, error and isValid
  isValidInput = (email) => {
    var res = true;
    var errors = {};
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      res = false;
      errors.email = "Enter Valid Email";
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
    const email = this.state.email;
    var { errors, isValid } = this.isValidInput(email);
    if (!isValid) {
      //if the input is invalid, set the errors state with the error object returned from isValidInput
      this.setState({ errors });
      return;
    }
    //valid input, proceed with server call.
    this.setState({ errors: {} });
    //save the context for later use
    fetch("/recovery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    })
  };

  login = () => {
    store.dispatch(logIn());
  };

  render() {
    const {errors} = this.state

    return (
      <div className="Recovery">
        <form onSubmit={this.handleSubmit}>
          <label className="label">Enter Your Email Address</label>
          <br />
          <input
            name="email"
            placeholder="Email Address"
            type="text"
            className="form-control"
            value={this.state.user}
            onChange={this.handleChange}
          />
          <br />
          <button className="btn btn-primary">Recover Password</button>
          <div>{errors.email}</div>
          <br></br>
          <NavLink to="/" > Login Page </NavLink>

        </form>
      </div>
    );
  }
}

export default Recovery;