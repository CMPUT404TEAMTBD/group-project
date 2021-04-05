import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { UserLogin } from "../types/UserLogin";
import {
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineInbox,
  HiOutlineCog,
  HiOutlineUser,
} from "react-icons/hi";

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

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const logOut = () => {
    props.setLoggedInUser(undefined);
  }

  // display pages accessible to a logged in author
  function loggedIn() {
    return (
      <>
        <NavItem onClick={close}>
          <NavLink to="/inbox" className="nav-link">
            <HiOutlineInbox size="1.5em" /> Inbox
          </NavLink>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink
            to={`/author/${props.loggedInUser?.authorId}`}
            className="nav-link"
          >
            <HiOutlineUser size="1.5em"/> Profile
          </NavLink>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink to="/settings" className="nav-link">
            <HiOutlineCog size="1.5em" /> Settings
          </NavLink>
        </NavItem>
        <NavItem onClick={close}>
          <NavLink to="/" className="nav-link" onClick={() => logOut()}>
            <HiOutlineLogout size="1.5em"/> Log Out
          </NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <div>
      <Navbar light expand="md">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav vertical className="ml-auto" navbar>
            <NavLink to="/" className="navbar-brand font-title">
              🗑🔥
            </NavLink>
            <NavItem onClick={close}>
              <NavLink to="/" className="nav-link">
                <HiOutlineHome size="1.5em"/> Feed
              </NavLink>
            </NavItem>
            {props.loggedInUser ? (
              loggedIn()
            ) : (
              <NavItem onClick={close}>
                <NavLink to="/auth/" className="nav-link">
                  <HiOutlineLogin size="1.5em"/> Log In
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}