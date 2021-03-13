import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { UserLogin } from "../types/UserLogin";
import FriendRequestList from "./FriendRequestList";

interface Props {
  loggedInUser: UserLogin | undefined;
  setLoggedInUser: React.Dispatch<React.SetStateAction<UserLogin | undefined>>;
}

/**
 * Originally from 
 * https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/components/NavbarComp.js
 * by ChrisChrisLoLo
 * 
 * App Navbar renders the navbar at the top of the page
 * Buttons to pages accessible to a registered author are displayed if logged in
 * Otherwise, only a log in button is displayed
 * @param props
 */
export default function AppNavBar(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFriendRequestOpen, setIsFriendRequestOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const logOut = () => props.setLoggedInUser(undefined);

  // display pages accessible to a logged in author
  function loggedIn() {
    return (
      <>
        <NavItem onClick={close}>
          <NavLink to="#" className="nav-link" onClick={() => setIsFriendRequestOpen(!isFriendRequestOpen)}>Friend Requests</NavLink>
          <Modal isOpen={isFriendRequestOpen} size="lg" toggle={() => setIsFriendRequestOpen(!isFriendRequestOpen)}>
                <ModalHeader toggle={() => setIsFriendRequestOpen(!isFriendRequestOpen)}>
                  Friend Requests
                </ModalHeader>
                <ModalBody>
                  <FriendRequestList {...props}/>
                </ModalBody>
              </Modal>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink to="/settings" className="nav-link">Settings</NavLink>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink to={`/author/${props.loggedInUser?.authorId}`} className="nav-link">Profile</NavLink>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink to="/" className="nav-link" onClick={() => logOut()}>Log Out</NavLink>
        </NavItem>
      </>
    )
  }

  return (
    <div>
      <Navbar color="dark" dark expand="md" >
        <NavbarToggler onClick={toggle} />
        <NavLink to="/" className="navbar-brand font-title">
          🗑🔥
        </NavLink>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {
              props.loggedInUser ?
                loggedIn() :
                <NavItem onClick={close}>
                  <NavLink to="/auth/" className="nav-link">Log In</NavLink>
                </NavItem>
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}