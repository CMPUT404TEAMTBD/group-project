import React from "react";
import { UserLogin } from "../types/UserLogin";

/**
 * Allows us to globally access the logged in user instead of having to manually pass it through props
 */
export const LoggedInUserContext = React.createContext<undefined|UserLogin>(
  undefined
);