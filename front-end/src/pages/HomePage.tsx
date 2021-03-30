import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Nav, NavItem, NavLink, TabContent, Card, CardTitle, TabPane, Container } from 'reactstrap';
import LikesFeed from '../components/LikesFeed';
import PostList from '../components/PostList';
import { Like } from '../types/Like';
import { Post } from '../types/Post';


/**
 * Renders the homepage which will display a stream of public posts
 * @param props 
 */
// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props: any) {

  const [userSearch, setUserSearch] = useState<string>('');
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [inboxEntries, setInboxEntries] = useState<Post[] | undefined>(undefined);
  const [likeEntries, setLikeEntries] = useState<Like[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  // get all public posts
  useEffect(() => {
    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/public-posts/", props.loggedInUser).then((res: any) => {
      const posts: Post[] = res.data;
      setPostEntries(posts);
    }).catch((err: any) => {
      console.error(err);
    });

    // if logged in, get posts from inbox
    if (props.loggedInUser) {
      AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/inbox/", props.loggedInUser).then((res: any) => {
        const inboxPosts: Post[] = res.data.items.filter((p: Post) => { return p.type === 'post' });
        // Reverse the posts so that they are in order (from newest to oldest).
        setInboxEntries(inboxPosts.reverse());
        const likes: Like[] = res.data.items.filter((p:any) => p.type === 'like');
        setLikeEntries(likes);
      }).catch((err: any) => {
        console.error(err);
      })
    }
  }, [activeTab]);
  // TODO: Dirty hack to make sure inbox is fresh. We might need to do a refactor to make sure the inbox data is fresh

  // update on search
  function onUserSearchChange(e: any) {
    setUserSearch(e.target.value);
  }

  // search for authors with the same displayName
  function searchUsers(e: any) {
    e.preventDefault();
    props.history.push(`/authors/${userSearch}`);
  }

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
    return (<PostList postEntries={inboxEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} isResharable={true}/>)
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
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col sm={2}>
            <Nav tabs vertical className="justify-content-md-center">
              <NavItem>
                <NavLink
                  // TODO: consider adding className
                  // className={classnames({ active: activeTab === '1' })}
                  className={`${true ? activeTab : ''}`}
                  onClick={() => { toggle('1'); }}
                >Public Feed</NavLink>
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
                <Container>
                  <Row>
                    <Col></Col>
                    <Col sm={8}>
                      {<PostList postEntries={postEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} isResharable={false}/>}
                    </Col>
                    <Col></Col>
                  </Row>
                </Container>
              </TabPane>
              <TabPane tabId="2">
                <Container>
                  <Row>
                    <Col></Col>
                    <Col sm={8}>
                      {props.loggedInUser ? displayInboxPosts() : displayLoginMessage()}
                      <LikesFeed likesList={likeEntries}></LikesFeed>
                    </Col>
                    <Col></Col>
                  </Row>
                </Container>
              </TabPane>
              <TabPane tabId="3">
                <Container>
                  <Row>
                    <Col></Col>
                    <Col sm={8}>
                      <Form inline={true} onSubmit={e => searchUsers(e)} className="justify-content-md-center">
                        <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)} />
                      </Form>
                    </Col>
                    <Col></Col>
                  </Row>
                </Container>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </>
  );
}