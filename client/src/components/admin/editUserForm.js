import React, { Component } from "react";

class EditUserForm extends Component {
  state = {
    id: this.props.id,
    email: this.props.email,
    password: this.props.password,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    userClass: this.props.userClass,
    onUserEdit: this.props.handleEdit,
    onChange: this.props.handleChange,
    msg: this.props.msg
  };
  render() {
    return (
      <div class="form-group">
        <form onSubmit={this.state.onUserEdit}>
          <div className="form-group col-md-6">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Email</label>
                <input
                  required
                  type="email"
                  name="editEmail"
                  className="form-control"
                  placeholder="Email"
                  onChange={this.state.onChange}
                  defaultValue={this.state.email}
                />
              </div>
              <div className="form-group col-md-6">
                <label>Password</label>
                <input
                  type="password"
                  name="editPassword"
                  className="form-control"
                  placeholder="Password"
                  onChange={this.state.onChange}
                  defaultValue={this.state.password}
                />
              </div>
            </div>
          </div>
          <div className="form-group col-md-6">
            <label>First Name</label>
            <input
              required
              type="text"
              name="editFirstName"
              className="form-control"
              placeholder="First Name"
              onChange={this.state.onChange}
              defaultValue={this.state.firstName}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Last name</label>
            <input
              required
              type="text"
              name="editLastName"
              className="form-control"
              placeholder="Last Name"
              onChange={this.state.onChange}
              defaultValue={this.state.lastName}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Permissions</label>
            <select
              required
              name="editUserClass"
              className="form-control"
              onChange={this.state.onChange}
              defaultValue={this.state.userClass}
            >
              <option />
              <option>sales</option>
              <option>supervisor</option>
              <option>administrator</option>
            </select>
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
        <div>{this.state.msg}</div>
      </div>
    );
  }
}

export default EditUserForm;
