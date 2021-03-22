import axios from 'axios';
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
  const authorUrl = process.env.REACT_APP_API_URL + "/api" + props.location.pathname;
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [responseMessage, setResponseMessage] = useState(100);
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [isFollowersListOpen, setIsFollowersListOpen] = useState<boolean>(false);

  // After clicking the profile navlink, get the appropriate author info and data
  useEffect(() => {
    axios.get(authorUrl).then(res => {
      const authorOb: Author = res.data;
      setAuthor(authorOb);
      setResponseMessage(200);
    }).catch(err => {
      console.log("ERROR GETTING AUTHOR INFO");
      setResponseMessage(500);
    })

    if (props.loggedInUser && !props.location.pathname.includes(props.loggedInUser.authorId)) {
      // get whether user is follower of author
      axios.get(authorUrl + "/followers/" + props.loggedInUser.authorId).then(res => {
        setIsFollower(true);
      }).catch(err => {
        // 404 is not a follower
        setIsFollower(false);
      })

      axios.get(authorUrl + "/posts/",
        {
          auth: { // authenticate the GET request
            username: props.loggedInUser.username,
            password: props.loggedInUser.password,
          }
        }
      ).then(res => {
        const posts: Post[] = res.data;
        setPostEntries(posts);
      }).catch(err => {
        console.log("ERROR GETTING POSTS");
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

  const displayFollowersListButton = () => {
    if (props.loggedInUser && author?.id === props.loggedInUser.authorId) {
      return <Button><CardLink className="text-white" href={props.loggedInUser.authorId + "/followers"} >Followers</CardLink></Button>
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
              <CardText>{displayFollowersListButton()}</CardText>
              {/* <CardLink className="nav-link" href={`/author/${props.author.id}/followers`}>Followers</CardLink> */}
            </CardBody>
          </Card>
        </Col>
        {/* <Link to={`/author/${props.author.id}/followers`} className="nav-link">View Profile</Link> */}
        <Col>
          {author && displayPosts()}
        </Col>
      </Row>
    </Container>
  );
}