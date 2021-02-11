import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import AppNavBar from './components/AppNavBar';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import { LoggedInUserContext } from './contexts/LoggedInUserContext';
import { UserLogin } from './types/UserLogin';


/*
* Snippet based on
* https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/App.js
* from ChrisChrisLoLo
*/
function App() {

  const [loggedInUser,setLoggedInUser] = useState<UserLogin | undefined>(undefined);

  return (
    <div>
      <LoggedInUserContext.Provider value={loggedInUser}>
      <BrowserRouter>
        <div>
          <AppNavBar/>
            <Container fluid={true}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/auth" render={(props) => <AuthPage {...props} setLoggedInUser={setLoggedInUser} />} />
                <Route component={NotFoundPage} />
              </Switch>
            </Container>
          </div>
        </BrowserRouter>
        </LoggedInUserContext.Provider>
    </div>
  );
}

export default App;
