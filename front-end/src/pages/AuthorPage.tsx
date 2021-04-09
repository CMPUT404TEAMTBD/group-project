import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Post } from '../types/Post';
import {
  Col,
  Container,
  Row,
  Alert,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  CardFooter,
} from 'reactstrap';
import { Author } from '../types/Author';
import FollowRequestButton from '../components/FriendRequestButton';
import { Link, RouteComponentProps } from 'react-router-dom';
import { isValidGithub } from '../helpers/GithubHelper';
import GithubFeed from '../components/GithubFeed';
import * as Icons from '../assets/Icons';
import ProfilePic from '../components/ProfilePic';
import clsx from 'clsx';
import PostList from '../components/PostList';

interface Props extends RouteComponentProps<MatchParams>{
  loggedInUser?: string,
}

interface MatchParams {
  authorId: string
}

/**
 * Author Page will render and display an author's profile - this includes information
 * about their user account and all the posts they have made
 * @param props 
 */
export default function AuthorPage(props: any) {
  const authorUrl = `${props.location.state.host}api/author/${props.location.state.id}/`;
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [responseMessage, setResponseMessage] = useState(100);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [isOtherAuthor, setIsOtherAuthor] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("githubTab");
  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
    if (tab === 'postsTab') displayPosts();
  }

  function displayPosts(){
      AxiosWrapper.get(`${authorUrl}posts/`, props.loggedInUser).then((res: any) => {
        const posts: Post[] = res.data;
        setPostEntries(posts);
      }).catch((err: any) => {
        setResponseMessage(500);
      });
  };
 
  // After clicking the profile navlink, get the appropriate author info and data
  useEffect(() => {
    AxiosWrapper.get(authorUrl, props.loggedInUser).then((res: any) => {
      const authorOb: Author = res.data;
      setAuthor(authorOb);
      setResponseMessage(200);
    }).catch((err: any) => {
      console.error("ERROR GETTING AUTHOR INFO");
      setResponseMessage(500);
    })

    if (props.loggedInUser) {
      // get whether user is follower of author IF not looking at our own profile
      if (!props.location.pathname.includes(props.loggedInUser.authorId)) {
        setIsOtherAuthor(true);
        AxiosWrapper.get(`${authorUrl}followers/${props.loggedInUser.authorId}/`, props.loggedInUser).then((res: any) => {
          setIsFollower(true);
        }).catch((err: any) => {
          // 404 is not a follower
          setIsFollower(false);
        });
      }
    };
  }, []);


  if (responseMessage > 299) {
    return (<Container>
      <Alert color="danger">An error occurred! Please try again</Alert>
    </Container>)
  }


  const displayProfileButtons = () => {
    if (props.loggedInUser && author?.id === props.loggedInUser.authorId) {
      return <ListGroupItem tag="a" href={`/author/${props.loggedInUser.authorId}/followers`}>Follows</ListGroupItem>
    } else {
      return <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={author} isFollower={isFollower} setIsFollower={setIsFollower} />
    }
  }

  return (
    <>
      <Row>
        <Col sm={3}>
          <Card>
            <CardHeader tag="h5" className="text-center">{author?.displayName}</CardHeader>
            <CardBody>
              <ProfilePic author={author} />
            </CardBody>
            <CardFooter>
              <ListGroup className="text-center">
                {displayProfileButtons()}
                <ListGroupItem tag="a" href={author ? author.github : "#"}>
                  GitHub
                </ListGroupItem>
              </ListGroup>
            </CardFooter>
          </Card>
        </Col>
        <Col>
          <Row className="justify-content-md-left">
            <Col>
              <Nav tabs light className="justify-content-md-left">
                <NavItem>
                  <NavLink
                    className={clsx({ active: activeTab === "githubTab" })}
                    onClick={() => toggle("githubTab")}
                  >
                    {Icons.githubIcon} GitHub Feed
                  </NavLink>
                </NavItem>
                {!isOtherAuthor && (
                  <NavItem>
                    <NavLink
                      className={clsx({ active: activeTab === "postsTab" })}
                      onClick={() => toggle("postsTab")}
                    >
                      {Icons.mailIcon} Posts
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col className="justify-content-md-left">
              <TabContent activeTab={activeTab}>
                <TabPane tabId="githubTab">
                  <Row style={{ padding: "1rem" }}>
                    <Col>
                      {author && isValidGithub(author.github) && (
                        <GithubFeed github={author.github} />
                      )}
                    </Col>
                  </Row>
                </TabPane>
                {!isOtherAuthor && (
                  <TabPane tabId="postsTab">
                    <Row style={{ padding: "1rem" }}>
                      {author && props.loggedInUser && (
                        <PostList
                          postEntries={postEntries}
                          setPostEntries={setPostEntries}
                          loggedInUser={props.loggedInUser}
                          isResharable={true}
                        />
                      )}
                    </Row>
                  </TabPane>
                )}
              </TabContent>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}