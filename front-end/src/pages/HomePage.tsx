import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Nav, NavItem, NavLink, TabContent, Button, Card, CardText, CardTitle, TabPane, Container } from 'reactstrap';
import CreateEditPostModal from '../components/CreateEditPostModal';
import PostList from '../components/PostList';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';


/**
 * Renders the homepage which will display a stream of public posts
 * @param props 
 */
// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props: any) {

  const [userSearch, setUserSearch] = useState<string>('');
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [followingPostEntries, setFollowingPostEntries] = useState<Post[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('1');
  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  // get all public posts
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/api/public-posts/",).then(res => {
      console.log(res.data);
      const posts: Post[] = res.data;
      setPostEntries(posts);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  // update on search
  function onUserSearchChange(e: any) {
    setUserSearch(e.target.value);
  }

  // search for authors with the same displayName
  function searchUsers(e: any) {
    e.preventDefault();
    props.history.push(`/authors/${userSearch}`);
  }

  return (
    <>
      {/* <Row> */}
      {/* <Col> */}
      <Container fluid>
        <Row className="justify-content-md-center">
        <Col sm={2}>
        <Nav tabs vertical className="justify-content-md-center">
          <NavItem>
            <NavLink
              // className={classnames({ active: activeTab === '1' })}
              // className={activeTab === '1' ? activeTab : ''}
              className={`${ true ? activeTab : ''}`}
              onClick={() => { toggle('1'); }}
            >Feed</NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              // className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >Inbox</NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              // className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >Search</NavLink>
          </NavItem>
        </Nav>
        </Col>
        <Col className="justify-content-md-center">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {/* <Row className="justify-content-md-center"> */}
              <Col sm={6}>
                {<PostList postEntries={postEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} />}
              </Col>
            {/* </Row> */}
          </TabPane>
          <TabPane tabId="2">
            {/* <Row className="justify-content-md-center"> */}
              <Col sm={6}>
                {<PostList postEntries={followingPostEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} />}
              </Col>
            {/* </Row> */}
          </TabPane>
          <TabPane tabId="3">
            {/* <Row className="justify-content-md-center"> */}
              <Col sm={8}>
                <Form inline={true} onSubmit={e => searchUsers(e)} className="justify-content-md-center">
                  <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)} />
                </Form>
              </Col>
            {/* </Row> */}
          </TabPane>
        </TabContent>
        </Col>
        </Row>
      </Container>
      {/* </Col> */}
      {/* </Row> */}
    </>
  );
}