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
import AuthorPage from './pages/AuthorPage';
import SettingsPage from './pages/SettingsPage';
import CreatePostComponent from './components/CreatePost';
import AuthorDetail from './pages/AuthorDetail';
import AuthorList from './components/AuthorList';


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
          <AppNavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
          <Container fluid={true}>
            <Switch>
              <Route exact path="/" render={(props) => <HomePage {...props} loggedInUser={loggedInUser} />} />
              <Route path="/auth" render={(props) => <AuthPage {...props} setLoggedInUser={setLoggedInUser} />} />
              {loggedInUser && <Route path={`/author/${loggedInUser.authorId}`} render={(props) => <AuthorPage {...props} loggedInUser={loggedInUser} />} />}
              {/* TODO: hide settings page if not logged in */}
              <Route path="/settings" render={(props) => <SettingsPage loggedInUser={loggedInUser} />} />
              <Route path="/author_detail/:id" render={(props) => <AuthorDetail {...props}/>} />
              <Route path="/create_post" render={(props) => <CreatePostComponent {...props} loggedInUser={loggedInUser} />} />
              <Route path="/authors/:displayName" render={(props) => <AuthorList {...props}/>}/>
  
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
