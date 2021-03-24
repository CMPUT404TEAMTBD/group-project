import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import AppNavBar from './components/AppNavBar';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import { LoggedInUserContext } from './contexts/LoggedInUserContext';
import { UserLogin } from './types/UserLogin';
import { Node } from './types/Node';
import AuthorPage from './pages/AuthorPage';
import SettingsPage from './pages/SettingsPage';
import CreatePostComponent from './components/CreatePost';
import AuthorResultsPage from './pages/AuthorResultsPage';
import PostDetailPage from './pages/PostDetailPage';
import FollowersPage from './pages/FollowersPage';

const LOCAL_STORAGE_USER = 'loggedInUser';

/*
* Snippet based on
* https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/App.js
* from ChrisChrisLoLo
*/
function App() {
  
  const initialJSON = localStorage.getItem(LOCAL_STORAGE_USER);
  const initialState:UserLogin|undefined = initialJSON ? JSON.parse(initialJSON) : undefined;

  const [loggedInUser,setLoggedInUser] = useState<UserLogin | undefined>(initialState);
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(()=>{
    if (loggedInUser === undefined){
      localStorage.removeItem(LOCAL_STORAGE_USER);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER,JSON.stringify(loggedInUser));
    }

    if (loggedInUser?.username !== undefined && loggedInUser?.password !== undefined) {
      // Keep track of a Node representing our own server
      setNodes(n => [...n, {
        "host": process.env.REACT_APP_API_URL, // TODO may need to strip http:// from this host.
        "username": loggedInUser?.username, 
        "password": loggedInUser?.password
      } as Node])
    }
  },[loggedInUser])

  // TODO wrap the below in NodesContext as well, and then use the Nodes in other components.
  // Talk to Chris about how to use React Context.
  return (
    <div>
      <LoggedInUserContext.Provider value={loggedInUser}>
      <BrowserRouter>
        <div>
          <AppNavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} setNodes={setNodes} />
          <Container fluid={true}>
            <Switch>
              <Route exact path="/" render={(props) => <HomePage {...props} loggedInUser={loggedInUser} />} />
              <Route path="/auth" render={(props) => <AuthPage {...props} setLoggedInUser={setLoggedInUser} setNodes={setNodes}/>} />
              <Route path="/author/:authorId/followers/" render={(props) => <FollowersPage {...props} loggedInUser={loggedInUser} />}/>
              <Route path="/author/:authorId" render={(props) => <AuthorPage {...props} loggedInUser={loggedInUser}/>}/>
              {/* TODO: hide settings page if not logged in */}
              <Route path="/settings" render={(props) => <SettingsPage loggedInUser={loggedInUser} />} />
              <Route path="/create_post" render={(props) => <CreatePostComponent {...props} loggedInUser={loggedInUser} />} />
              <Route path="/authors/:displayName" render={(props) => <AuthorResultsPage {...props} loggedInUser={loggedInUser}/>}/>
              <Route path="/posts/:postId" render={(props) => <PostDetailPage {...props} loggedInUser={loggedInUser}/>}/>
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
