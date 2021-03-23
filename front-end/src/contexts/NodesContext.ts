import React from "react";
import { Node } from "../types/Node";

/**
 * Allows App to globally access the logged in user after login/registration. 
 * App then sends UserLogin through props to child components.
 */
export const NodesContext = React.createContext<Node[]>([]);