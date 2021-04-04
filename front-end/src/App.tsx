import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Card, CardTitle, Col, Container, Row } from 'reactstrap';
import AppNavBar from './components/AppNavBar';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import { LoggedInUserContext } from './contexts/LoggedInUserContext';
import { UserLogin } from './types/UserLogin';
import AuthorPage from './pages/AuthorPage';
import SettingsPage from './pages/SettingsPage';
import CreatePostComponent from './components/CreatePost';
import AuthorResultsPage from './pages/AuthorResultsPage';
import PostDetailPage from './pages/PostDetailPage';
import FollowListPage from './pages/FollowListPage';
import InboxPage from './pages/InboxPage';
import AppSidebar from './components/AppSidebar';

const LOCAL_STORAGE_USER = 'loggedInUser';

/*
* Snippet based on
* https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/App.js
* from ChrisChrisLoLo
*/
function App() {
  
  const initialUserJSON = localStorage.getItem(LOCAL_STORAGE_USER);
  const initialUserState: UserLogin|undefined = initialUserJSON ? JSON.parse(initialUserJSON) : undefined;
  const [loggedInUser,setLoggedInUser] = useState<UserLogin | undefined>(initialUserState);

  useEffect(()=>{
    if (loggedInUser === undefined){
      localStorage.removeItem(LOCAL_STORAGE_USER);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER,JSON.stringify(loggedInUser));
    }
  },[loggedInUser])

  return (
    <div>
      <LoggedInUserContext.Provider value={loggedInUser}>
      <BrowserRouter>
        <div>
          <Container>
            <Row style={{padding: '5%'}} className="justify-content-md-center">
              <Col xs="2"><AppNavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /></Col>
              <Col>
              <Switch>
              <Route exact path="/" render={(props) => <HomePage {...props} loggedInUser={loggedInUser} />} />
              <Route path="/auth" render={(props) => <AuthPage {...props} setLoggedInUser={setLoggedInUser} />} />
              <Route path="/inbox" render={(props) => <InboxPage {...props} loggedInUser={loggedInUser} /> } />
              <Route path="/author/:authorId/followers/" render={(props) => <FollowListPage {...props} loggedInUser={loggedInUser} activeTab={'followers'} />}/>
              <Route path="/author/:authorId/following/" render={(props) => <FollowListPage {...props} loggedInUser={loggedInUser} activeTab={'following'}/>}/>
              <Route path="/author/:authorId" render={(props) => <AuthorPage {...props} loggedInUser={loggedInUser}/>}/>
              {/* TODO: hide settings page if not logged in */}
              <Route path="/settings" render={() => <SettingsPage loggedInUser={loggedInUser} />} />
              <Route path="/create_post" render={(props) => <CreatePostComponent {...props} loggedInUser={loggedInUser} />} />
              <Route path="/authors/:displayName" render={(props) => <AuthorResultsPage {...props} loggedInUser={loggedInUser} />}/>
              <Route path="/posts/:postId" render={(props) => <PostDetailPage {...props} loggedInUser={loggedInUser}/>}/>
              <Route component={NotFoundPage} />
            </Switch>
              </Col>
            </Row>
          </Container>
          </div>
        </BrowserRouter>
      </LoggedInUserContext.Provider>
    </div>
  );
}

export default App;
