import React, { Component } from "react";
import Users from "./users";
import Modal from "react-modal";
import EditUserForm from "./editUserForm";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class AdminConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //store values in state and use for auth
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      userClass: "",
      msg: "",
      users: [],
      usersIsLoaded: false,
      usersError: null,
      usersMsg: "",
      editId: "",
      editEmail: "",
      editPassword: "",
      editFirstName: "",
      editLastName: "",
      editUserClass: "",
      editModalOpen: false,
      editMsg: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  closeEditModal = () => {
    this.setState({ editModalOpen: false });
  };

  updateUsersTable = () => {
    fetch("/employeeData") //uses the proxy to send request to server for data
      .then(res => res.json())
      .then(
        users =>
          this.setState({ usersIsLoaded: true, users }, () =>
            console.log("Users fetched..", users)
          ),
        error => {
          this.setState({ usersIsLoaded: true, usersError: error });
        }
      );
  };

  //input validator, returns an object with two members, error and isValid
  isValidInput = (email, password, permissions) => {
    var res = true;
    var errors = {};
    if (email.length === 0) {
      res = false;
      errors.email = "Valid email is required";
    }
    if (password.length === 0) {
      res = false;
      errors.password = "Password is required";
    }
    if (permissions.length === 0) {
      res = false;
      errors.password = "User class is required";
    }
    return { errors, isValid: res };
  };

  handleUserDelete = id => {
    console.log("delete user", id);
    this.setState({ msg: "" });
    let self = this;
    fetch("/admin/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: id
      })
    })
      .then(res => {
        return res.text();
      })
      .then(function(data) {
        self.setState({ msg: data });
        self.updateUsersTable();
      });
  };

  handleUserOpenEdit = id => {
    //Todo: implement user edit
    var editUser = this.state.users.find(function(user) {
      return user.userId === id;
    });
    console.log(editUser);
    console.log(this.state.users);
    this.setState({
      editId: id,
      editEmail: editUser.email,
      editPassword: editUser.password,
      editFirstName: editUser.firstName,
      editLastName: editUser.lastName,
      editUserClass: editUser.userClass,
      editModalOpen: true
    });
  };

  handleUserSubmitEdit = event => {
    event.preventDefault();
    const {
      editId,
      editEmail,
      editPassword,
      editFirstName,
      editLastName,
      editUserClass
    } = this.state;
    //Todo: validate edit input
    this.setState({ msg: "" });
    let self = this;
    fetch("/admin/editUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: editId,
        user: editEmail,
        password: editPassword,
        firstName: editFirstName,
        lastName: editLastName,
        userClass: editUserClass
      })
    })
      .then(res => {
        return res.text();
      })
      .then(function(data) {
        //can't use 'this' here due to context loss in promise
        self.setState({ editMsg: data });
        self.closeEditModal();
        self.updateUsersTable();
      });
  };

  //when any field in the form is changed, update the state to reflect the new values
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password, firstName, lastName, userClass } = this.state;
    var { errors, isValid } = this.isValidInput(email, password, userClass);
    if (!isValid) {
      //if the input is invalid, set the errors state with the error object returned from isValidInput
      this.setState({ errors });
      return;
    }
    //valid input
    this.setState({ msg: "" });
    let self = this;
    fetch("/admin/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userClass: userClass
      })
    })
      .then(res => {
        return res.text();
      })
      .then(function(data) {
        //can't use 'this' here due to context loss in promise
        self.setState({ msg: data });
        self.updateUsersTable();
      });
  };

  render() {
    return (
      <div className="container-fluid">
        <Modal
          isOpen={this.state.editModalOpen}
          style={modalStyles}
          onRequestClose={this.closeEditModal}
        >
          <EditUserForm
            id={this.state.editId}
            email={this.state.editEmail}
            password={this.state.editPassword}
            firstName={this.state.editFirstName}
            lastName={this.state.editLastName}
            userClass={this.state.editUserClass}
            msg={this.state.msg}
            handleEdit={this.handleUserSubmitEdit}
            handleChange={this.handleChange}
          />
        </Modal>
        <Users
          error={this.state.usersError}
          usersLoaded={this.state.usersIsLoaded}
          users={this.state.users}
          onUpdateUsersTable={this.updateUsersTable}
          onUserEdit={this.handleUserOpenEdit}
          onUserDelete={this.handleUserDelete}
        />
        <br />
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group col-md-6">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="inputEmail4"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="inputPassword4"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-md-6">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                id="inputFname"
                placeholder="First Name"
                value={this.state.firstName}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                id="inputLname"
                placeholder="Last Name"
                value={this.state.lastName}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Permissions</label>
              <select
                id="inputClass"
                name="userClass"
                className="form-control"
                value={this.state.userClass}
                onChange={this.handleChange}
              >
                <option>Choose...</option>
                <option>sales</option>
                <option>supervisor</option>
                <option>administrator</option>
              </select>
            </div>
            <button className="btn btn-primary">Create</button>
          </form>
          <div>{this.state.msg}</div>
        </div>
      </div>
    );
  }
}

export default AdminConsole;
