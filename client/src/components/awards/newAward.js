import React, { Component } from "react";
import "./newAward.css";
import store from "../../store/store";

//TODO: add error messages from server when user not found
const initialState = {
  employeeFirstName: "",
  employeeLastName: "",
  employeeEmail: "",
  sendDate: "",
  sendTime: "",
  empId: "",
  awardClass: "",
  firstNameError: "",
  lastNameError: "",
  emailError: "",
  dateError: "",
  timeError: "",
  awardError: "",
  selectedEmployee: "",
};

class CreateAwardForm extends Component {
  state = {
    initialState,
    empOnSys: []
  };

  componentDidMount() {
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
                   //console.log("id sent " + this.state.id);
                   let initialEmployees = [];
                   fetch('/user/employeesonsystem?id=' + this.state.id)
                       .then(response => {
                           return response.json();
                       })
                       .then(data => {
                         //console.log(JSON.stringify(data));
                         initialEmployees = data.map((employee) => { return {id: employee.id, firstName: employee.firstName, lastName: employee.lastName}})
                           this.setState({empOnSys: [{value: " ", display: "(select employee)"}].concat(initialEmployees)});
                       }).catch(error => {
                         console.log(error);
                       });
            }).catch(error => {
              console.log(error);
            });
  }

  handleChange = event => {
    console.log(event.target.name);
    if(event.target.name === "selectedEmployee"){
      console.log("auto enter data");
      console.log(this.state);

      //valid input
      const encodedValue = encodeURIComponent(event.target.value);
      fetch("/user/getemployee?id=" + event.target.value, {
        method: "GET"
      }).then(res => {
        return res.json();
        //return res.text();
      })
      .then(data => {
        console.log("Thisi is form the server api: " + data[0].firstName)
        this.setState({ 
          employeeFirstName: data[0].firstName, 
          employeeLastName: data[0].lastName,
          employeeEmail: data[0].email,
          sendDate: data[0].sendDate,
          sendTime: data[0].sendTime,
          empId: data[0].id,
         });
      })
    }
    else
    this.setState({ [event.target.name]: event.target.value });
  };

  validate = () => {
    let firstNameError = "";
    let lastNameError = "";
    let emailError = "";
    let awardError = "";
    let dateError = "";
    let timeError = "";

    if (!this.state.employeeFirstName) {
      firstNameError = "First name is required";
    }

    if (!this.state.employeeLastName) {
      lastNameError = "Last name is required";
    }

    if (!this.state.employeeEmail.includes("@")) {
      emailError = "Invalid email";
    }

    if (!this.state.awardClass) {
      awardError = "Select award type";
    }

    if (!this.state.sendDate) {
      dateError = "Enter a send date";
    }

    if (!this.state.sendTime) {
      timeError = "Enter a send time";
    }

    if (
      emailError ||
      firstNameError ||
      lastNameError ||
      awardError ||
      dateError ||
      timeError
    ) {
      this.setState({
        emailError,
        firstNameError,
        lastNameError,
        awardError,
        dateError,
        timeError
      });
      return false;
    }

    return true;
  };

  handleSubmit = event => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      console.log(this.state);
        //valid input
        fetch("/user/addAward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            awardTypeID: this.state.awardClass,
            date: this.state.sendDate,
            time: this.state.sendTime,
            firstName: this.state.employeeFirstName,
            lastName: this.state.employeeLastName,
            email: this.state.employeeEmail
          })
        }).then(res => {
          return res.text();
        })
        .then(message => {
          if (message === "User not found") {
            fetch("/user/addEmployee", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                firstName: this.state.employeeFirstName,
                lastName: this.state.employeeLastName,
                email: this.state.employeeEmail
              })
            })
                fetch("/user/addAward", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
          
                  body: JSON.stringify({
                    awardTypeID: this.state.awardClass,
                    date: this.state.sendDate,
                    time: this.state.sendTime,
                    firstName: this.state.employeeFirstName,
                    lastName: this.state.employeeLastName,
                    email: this.state.employeeEmail
                  })
                }).then(res => {
                  return res.text();
                })
            //clear form
            this.setState(initialState);
          }
          //clear form
          this.setState(initialState);
        });
      }
  };

  render() {

    return (
      <div class="form-style-6">
        <h1>Create a New Award</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <h6>Select Employee</h6>
            <select 
              name="selectedEmployee"
              value={this.state.selectedEmployee} 
              //onChange={(e) => this.setState({selectedTeam: e.target.value})}
              onChange={this.handleChange}
            >
              {this.state.empOnSys.map((Emp) => <option key={Emp.id} value={Emp.id}>{Emp.id} {Emp.firstName} {Emp.lastName}</option>)}
            </select>
          </div>

          <h6>Or Enter New Employee</h6>
          <div style={{ color: "red" }}>{this.state.firstNameError}</div>
          <input
            type="text"
            name="employeeFirstName"
            placeholder="First Name"
            value={this.state.employeeFirstName}
            onChange={this.handleChange}
          />
          <div style={{ color: "red" }}>{this.state.lastNameError}</div>
          <input
            type="text"
            name="employeeLastName"
            placeholder="Last Name"
            value={this.state.employeeLastName}
            onChange={this.handleChange}
          />
          <div style={{ color: "red" }}>{this.state.emailError}</div>
          <input
            type="email"
            name="employeeEmail"
            placeHolder="Email"
            value={this.state.employeeEmail}
            onChange={this.handleChange}
          />
          <div style={{ color: "red" }}>{this.state.awardError}</div>
          <select
            name="awardClass"
            value={this.state.awardClass}
            onChange={this.handleChange}
          >
            <option value="" disabled selected>Select Award Type</option>
            <option value="1">Employee of the Month</option>
            <option value="2">Employee of the Week</option>
            <option value="3">Highest Sales in a Month</option>
          </select>
          <div style={{ color: "red" }}>{this.state.dateError}</div>
          Send Date (mm/dd/yyyy):
          <input
            type="date"
            name="sendDate"
            value={this.state.sendDate}
            onChange={this.handleChange}
          />
          <div style={{ color: "red" }}>{this.state.timeError}</div>
          Send Time (hh:mm am/pm):
          <input
            type="time"
            name="sendTime"
            value={this.state.sendTime}
            onChange={this.handleChange}
          />
          <input type="submit" value="Create Award" />
        </form>
      </div>
    );
  }
}

export default CreateAwardForm;
