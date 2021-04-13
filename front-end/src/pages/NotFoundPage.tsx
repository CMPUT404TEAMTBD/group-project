import React from 'react';
import { Jumbotron } from 'reactstrap';
import * as Icons from '../assets/Icons';

export default function NotFoundPage() {
  return (
    <div style={{padding: '3rem'}}>
    <Jumbotron>
     <h1>404, Nothing Here :(</h1>
     <a href="/" style={{color: "grey"}}>{Icons.backIcon} Go to Home Page</a>
    </Jumbotron>
    </div>
  );
}

