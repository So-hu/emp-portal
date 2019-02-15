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
        <table className="table">
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
            {users.map(users => (
              <tr key={users.userId}>
                <td>{users.lastName}</td>
                <td>{users.firstName}</td>
                <td>{users.email}</td>
                <td>{users.userClass}</td>
                <td>{users.accountCreated}</td>
                <td>
                  <button
                    onClick={() => onUserEdit(users.userId)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onUserDelete(users.userId)}
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
