import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Form,
  Input,
  Button,
} from "reactstrap";
import {NavLink} from "react-router-dom";

/**
 * Originally from 
 * https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/components/NavbarComp.js
 * by ChrisChrisLoLo
 */

export default class NavbarComp extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  close(){
    this.setState({
      isOpen: false
    });
  }

  logOut(){
    this.props.setLoggedInUser(undefined);
  }

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavLink to="/" className="navbar-brand font-title">
          🗑🔥
          </NavLink>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem onClick={this.close}>
                <NavLink to="/settings" className="nav-link">Settings</NavLink>
              </NavItem>
              {this.props.loggedInUser ?
                <NavItem onClick={this.close}>
                  <a onClick={this.logOut}>Log Out</a>
                </NavItem> :
                <NavItem onClick={this.close}>
                  <NavLink to="/auth/" className="nav-link">Log In</NavLink>
                </NavItem>
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}