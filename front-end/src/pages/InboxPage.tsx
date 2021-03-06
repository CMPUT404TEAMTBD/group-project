import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Nav, NavItem, NavLink, TabContent, Card, CardTitle, TabPane, Container, Button, NavbarToggler, CardBody } from 'reactstrap';
import LikesFeed from '../components/LikesFeed';
import PostList from '../components/PostList';
import { Like } from '../types/Like';
import { Post } from '../types/Post';
import { Follow } from '../types/Follow';
import AuthorListItem from '../components/AuthorListItem';
import clsx from 'clsx'; 
import * as Icons from '../assets/Icons';


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
    return (<PostList postEntries={inboxEntries} setPostEntries={setInboxEntries} loggedInUser={props.loggedInUser} isResharable={true} displayCreateButton={false}/>)
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

  function clearInbox() {
    AxiosWrapper.delete(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/inbox/", props.loggedInUser).then((res: any) => {
      setInboxEntries([]);
      setLikeEntries([]);
      setFriendReqEntries([]);
    }).catch((err: any) => {
      console.error(err);
    })
  }

  return (
    <>
      <Row className="justify-content-md-left">
        <Col>
          <Nav tabs light className="justify-content-md-left">
            <NavItem>
              <NavLink
                className={clsx({ active: activeTab === "postsTab" })}
                onClick={() => toggle("postsTab")}>
                {Icons.mailIcon} Posts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={clsx({ active: activeTab === "followsTab" })}
                onClick={() => toggle("followsTab")}>
                {Icons.peopleIcon} Follows
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={clsx({ active: activeTab === "likesTab" })}
                onClick={() => toggle("likesTab")}>
                {Icons.likeButtonIcon} Likes
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col className="justify-content-md-right" sm={2}><NavLink onClick={clearInbox}>{Icons.clearInboxIcon} Clear</NavLink></Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="justify-content-md-left">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="postsTab">
              <Row style={{ padding: "1rem" }}>
                <Col>
                  {props.loggedInUser
                    ? displayInboxPosts()
                    : displayLoginMessage()}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="followsTab">
              <Row style={{ padding: "1rem" }}>
                <Col>
                  {friendReqEntries?.length !== 0 ? (
                    friendReqEntries?.map((follow: Follow) => (
                      <AuthorListItem
                        author={follow.actor}
                        loggedInUser={props.loggedInUser}
                      ></AuthorListItem>
                    ))
                  ) : (
                    <Card body className="text-center">
                      <CardBody>
                        <CardTitle tag="h5">No Friend Requests :(</CardTitle>
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="likesTab">
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <LikesFeed likesList={likeEntries}></LikesFeed>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
}