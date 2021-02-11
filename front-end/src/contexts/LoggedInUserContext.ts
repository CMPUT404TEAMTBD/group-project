import React from "react";
import { UserLogin } from "../types/UserLogin";

export const LoggedInUserContext = React.createContext<undefined|UserLogin>(
  undefined
);