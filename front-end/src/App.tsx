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
import { AxiosWrapper } from './helpers/AxiosWrapper'
import AuthorPage from './pages/AuthorPage';
import SettingsPage from './pages/SettingsPage';
import CreatePostComponent from './components/CreatePost';
import AuthorResultsPage from './pages/AuthorResultsPage';
import PostDetailPage from './pages/PostDetailPage';
import FollowersPage from './pages/FollowersPage';

const LOCAL_STORAGE_USER = 'loggedInUser';
const LOCAL_STORAGE_NODES = 'nodes';

/*
* Snippet based on
* https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/App.js
* from ChrisChrisLoLo
*/
function App() {
  
  const initialUserJSON = localStorage.getItem(LOCAL_STORAGE_USER);
  const initialUserState: UserLogin|undefined = initialUserJSON ? JSON.parse(initialUserJSON) : undefined;
  const [loggedInUser,setLoggedInUser] = useState<UserLogin | undefined>(initialUserState);

  const initialNodesJSON = localStorage.getItem(LOCAL_STORAGE_NODES);
  const initialNodesState: Node[] = initialNodesJSON ? JSON.parse(initialNodesJSON) : [];
  const [nodes, setNodes] = useState<Node[]>(initialNodesState);

  useEffect(()=>{
    if (loggedInUser === undefined){
      localStorage.removeItem(LOCAL_STORAGE_USER);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER,JSON.stringify(loggedInUser));

      // Already have a Node for our own server.
      if (nodes.filter(n => n.username === loggedInUser.username).length !== 0) {
        return;
      }

      // Strip http:// or https:// from our own API URL
      const host = process.env.REACT_APP_API_URL?.replace("http://", "").replace("https://", "");

      // Keep track of a Node representing our own server
      setNodes([...nodes, {
        host: host,
        username: loggedInUser?.username, 
        password: loggedInUser?.password
      } as Node])
    }
  },[loggedInUser, nodes])

  useEffect(() => {
    console.log("Nodes: ");
    console.log(nodes);
    AxiosWrapper.nodes = nodes;
    if (nodes.length === 0){
      localStorage.removeItem(LOCAL_STORAGE_NODES);
    } else {
      localStorage.setItem(LOCAL_STORAGE_NODES, JSON.stringify(nodes));
    }
  }, [nodes])

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
