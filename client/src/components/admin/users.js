import React, { Component } from "react";
import Modal from "react-modal";
import store from "../../store/store";

class Users extends Component {
  state = {};

  componentDidMount() {
    this.props.onUpdateUsersTable();
  }

  getDeleteButton = id => {
    if (store.getState().userData.id !== id) {
      return (
        <button
          onClick={() => this.props.onUserDelete(id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      );
    }
  };

  render() {
    const { onUserDelete, onUserEdit, users, error, usersLoaded } = this.props;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!usersLoaded) {
      return <div>Loading.....</div>;
    }
    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.userClass}</td>
                <td>{user.accountCreated}</td>
                <td>
                  <button
                    onClick={() => onUserEdit(user.id, onUserDelete)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  {this.getDeleteButton(user.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Users;
