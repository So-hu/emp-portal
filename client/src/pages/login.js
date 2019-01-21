import React, { Component } from "react";

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {//store values in state and use for auth
        user: '',
        password: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

      handleChange = event => {
          this.setState({[event.target.id]: event.target.value
        });
      }

      handleSubmit = event => {
          event.preventDefault();
          //todo:replace this block with auth code
          //todo:modify login state in app.js
      }

      //todo:add a validate form function later
      //validateFunction(){}
    
      render(){
          return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username:
                        <input type="text" onChange={this.handleChange}/>
                </label>
                <br></br>
                <label>
                    Password:
                        <input type="text" onChange={this.handleChange}/>
                </label>
                <br></br>
                <input type="submit" value="Submit"/>
            </form>
          );
      }
}

export default Login;