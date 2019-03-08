import React, { Component } from "react";
import Modal from "react-modal";

class Users extends Component {
  state = {};

  componentDidMount() {
    this.props.onUpdateUsersTable();
  }

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
                    onClick={() => onUserEdit(user.id)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onUserDelete(user.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
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
