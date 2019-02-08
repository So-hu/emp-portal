//create navbar component for use by other pages
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

//Simple bootstrap navbar; maps NavLinks from the routes parameter in props
class Navbar extends Component {
  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink to="/homepage" className="navbar-brand">
          Award Generation Portal
        </NavLink>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav">
            {this.props.routes.map(r => (
              <li class="nav-item">
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
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
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
