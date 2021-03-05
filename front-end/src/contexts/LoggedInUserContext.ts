import React from "react";
import { UserLogin } from "../types/UserLogin";

/**
 * Allows App to globally access the logged in user after login/registration. 
 * App then sends UserLogin through props to child components.
 */
export const LoggedInUserContext = React.createContext<undefined|UserLogin>(
  undefined
);