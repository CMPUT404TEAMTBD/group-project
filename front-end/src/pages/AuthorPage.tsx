import axios from 'axios';
import { useEffect, useState } from 'react';
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
} from 'reactstrap';
import { Author } from '../types/Author';
import FollowRequestButton from '../components/FriendRequestButton';

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

    // get whether user is follower of author
    axios.get(authorUrl + "/followers/" + props.loggedInUser.authorId).then(res => {
      setIsFollower(true);
    }).catch(err => {
      // 404 is not a follower
      setIsFollower(false);
    })

    // Only get stream if you're viewing your own profile
    if (props.loggedInUser) {
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

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm={2}>
          <Card body className="text-center">
            {profilePic()}
            <CardBody>
              <CardTitle tag="h5">{author?.displayName}</CardTitle>
              <CardLink href={author ? author.github : "#"} >GitHub</CardLink>
            </CardBody>
          </Card>
          {author?.id !== props.loggedInUser.authorId ? <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={author} isFollower={isFollower} setIsFollower={setIsFollower} /> : null}
        </Col>
        {author && displayPosts()}
      </Row>
    </Container>
  );
}