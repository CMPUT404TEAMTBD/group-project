import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import PostList from '../components/PostList';
import { Post } from '../types/Post';
import {
  Col,
  Container,
  Row,
  Alert,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardLink,
  CardText,
  CardSubtitle,
  Button,
} from 'reactstrap';
import { Author } from '../types/Author';
import FollowRequestButton from '../components/FriendRequestButton';
import { Link } from 'react-router-dom';

/**
 * Author Page will render and display an author's profile - this includes information
 * about their user account and all the posts they have made
 * @param props 
 */
export default function AuthorPage(props: any) {
  // TODO: don't use props.location.pathname
  const authorUrl = process.env.REACT_APP_API_URL + "/api" + props.location.pathname;
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [responseMessage, setResponseMessage] = useState(100);
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [isFollowersListOpen, setIsFollowersListOpen] = useState<boolean>(false);

  // After clicking the profile navlink, get the appropriate author info and data
  useEffect(() => {
    AxiosWrapper.get(authorUrl).then((res: any) => {
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
        AxiosWrapper.get(authorUrl + "/followers/" + props.loggedInUser.authorId).then((res: any) => {
          setIsFollower(true);
        }).catch((err: any) => {
          // 404 is not a follower
          setIsFollower(false);
        });
      }

      AxiosWrapper.get(authorUrl + "/posts/").then((res: any) => {
        const posts: Post[] = res.data;
        setPostEntries(posts);
      }).catch((err: any) => {
        console.error("ERROR GETTING POSTS");
        setResponseMessage(500);
      })
    };
  }, []);

  // Author's profile pic will be the same one from their GitHub
  const profilePic = () => {
    if (author?.github?.includes("github.com")) {
      return <CardImg top width="100%" src={author.github + ".png"} alt="Card image cap" />
    }

    return null
  }

  if (responseMessage > 299) {
    return (<Container>
      <Alert color="danger">An error occurred! Please try again</Alert>
    </Container>)
  }

  const displayPosts = () => {
    if (props.loggedInUser) {
      return <PostList postEntries={postEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} />
    }
  }

  const displayFollowButton = () => {
    if (props.loggedInUser && author?.id !== props.loggedInUser.authorId) {
      return <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={author} isFollower={isFollower} setIsFollower={setIsFollower} />
    }
  }

  const displayFollowListButtons = () => {
    if (props.loggedInUser && author?.id === props.loggedInUser.authorId) {
      return (<>
        <CardText>
          <Button><CardLink className="text-white" href={"/author/" + props.loggedInUser.authorId + "/followers"}>Followers</CardLink></Button>
        </CardText>
        <CardText>
          <Button><CardLink className="text-white" href={"/author/" + props.loggedInUser.authorId + "/following"}>Following</CardLink></Button>
        </CardText>
      </>)
    }
  }

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm={2}>
          <Card body className="text-center">
            {profilePic()}
            <CardBody>
              <CardTitle tag="h3">{author?.displayName}</CardTitle>
              <CardText>
                <Button><CardLink className="text-white" href={author ? author.github : "#"} >GitHub</CardLink></Button>
              </CardText>
              <CardText>{displayFollowButton()}</CardText>
              {displayFollowListButtons()}
            </CardBody>
          </Card>
        </Col>
        <Col>
          {author && displayPosts()}
        </Col>
      </Row>
    </Container>
  );
}