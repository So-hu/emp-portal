//create navbar component for use by other pages
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

//Simple bootstrap navbar; maps NavLinks from the routes parameter in props
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink to="/homepage" className="navbar-brand">
          Award Generation Portal
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {this.props.routes.map(r => (
              <li key={r.name} className="nav-item">
                <NavLink
                  to={r.route}
                  className="nav-link"
                  activeClassName="active"
                >
                  {r.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink
                to="/logout"
                className="nav-link"
                activeClassName="active"
              >
                Log Out
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
