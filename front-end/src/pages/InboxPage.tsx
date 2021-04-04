import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Nav, NavItem, NavLink, TabContent, Card, CardTitle, TabPane, Container, Button, NavbarToggler, CardBody } from 'reactstrap';
import LikesFeed from '../components/LikesFeed';
import PostList from '../components/PostList';
import { Like } from '../types/Like';
import { Post } from '../types/Post';
import { Follow } from '../types/Follow';
import AuthorListItem from '../components/AuthorListItem';
import AppSidebar from '../components/AppSidebar';
var classNames = require('classnames');


/**
 * Renders the homepage which will display a stream of public posts
 * @param props 
 */
// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props: any) {
  const [inboxEntries, setInboxEntries] = useState<Post[] | undefined>(undefined);
  const [likeEntries, setLikeEntries] = useState<Like[]>([]);
  const [friendReqEntries, setFriendReqEntries] = useState<Follow[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("postsTab");
  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }
  const mailIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25">
      <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
  const peopleIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25">
      <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
  const likesIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25" width="25">
      <path strokeLinecap="round" strokeLinejoin="round" stroke="black" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);

  // get all public posts
  useEffect(() => {
    // if logged in, get posts from inbox
    if (props.loggedInUser) {
      AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/inbox/", props.loggedInUser).then((res: any) => {
        const inboxPosts: Post[] = res.data.items.filter((p: Post) => { return p.type === 'post' });
        // Reverse the posts so that they are in order (from newest to oldest).
        setInboxEntries(inboxPosts.reverse());
        const likes: Like[] = res.data.items.filter((p:any) => p.type === 'like');
        setLikeEntries(likes);
        const friendReqs: Follow[] = res.data.items.filter((fr: Follow) => { return fr.type === 'follow' });
        setFriendReqEntries(friendReqs);
      }).catch((err: any) => {
        console.error(err);
      })
    }
  }, [activeTab]);
  // TODO: Dirty hack to make sure inbox is fresh. We might need to do a refactor to make sure the inbox data is fresh

  // display empty inbox or inbox posts
  function displayInboxPosts() {
    if (!inboxEntries || inboxEntries.length === 0) {
      return (
        <>
          <Card body className="text-center">
            <CardTitle tag="h5">Inbox is empty!</CardTitle>
          </Card>
        </>
      )
    }
    return (<PostList postEntries={inboxEntries} setPostEntries={setInboxEntries} loggedInUser={props.loggedInUser} isResharable={true}/>)
  }

  // display card that prompts log-in to be able to see inbox posts
  function displayLoginMessage() {
    return (
      <>
        <Card body className="text-center">
          <CardTitle tag="h5">Log in to see posts from who you follow!</CardTitle>
        </Card>
      </>)
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col>
          <Nav tabs light className="justify-content-md-center">
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "postsTab" })}
                onClick={() => toggle("postsTab")} >
                {mailIcon} Posts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "followsTab" })}
                onClick={() => toggle("followsTab")} >
                {peopleIcon} Follows
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "likesTab" })}
                onClick={() => toggle("likesTab")} >
                {likesIcon} Likes
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="justify-content-md-center">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="postsTab">
              <Container>
                <Row>
                  <Col>
                    {props.loggedInUser ? displayInboxPosts() : displayLoginMessage()}
                  </Col>
                </Row>
              </Container>
            </TabPane>
            <TabPane tabId="followsTab">
              <Container>
                <Row>
                  <Col>
                    {friendReqEntries?.length !== 0 ? (
                      friendReqEntries?.map((follow: Follow) => (
                        <AuthorListItem author={follow.actor} loggedInUser={props.loggedInUser}></AuthorListItem>))
                    ) : (
                      <Card body className="text-center">
                        <CardBody>
                          <CardTitle tag="h5">No Friend Requests :(</CardTitle>
                        </CardBody>
                      </Card>
                    )}
                  </Col>
                </Row>
              </Container>
            </TabPane>
            <TabPane tabId="likesTab">
              <Container>
                <Row>
                  <Col>
                    <LikesFeed likesList={likeEntries}></LikesFeed>
                  </Col>
                </Row>
              </Container>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
}