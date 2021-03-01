import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserLogin } from '../types/UserLogin';
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
  CardSubtitle,
  CardText,
  CardLink,
} from 'reactstrap';
import PostListItem from '../components/PostListItem';

interface Props {
  loggedInUser: UserLogin | undefined;
}

// https://react-bootstrap.github.io/layout/grid/
export default function AuthorPage(props: Props) {
  const authorId = props.loggedInUser ? props.loggedInUser.authorId + "/" : "";
  const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + authorId;
  const initialInputState = { displayName: undefined, github: undefined };
  const [author, setAuthor] = useState(initialInputState);
  const [responseMessage, setResponseMessage] = useState(100);
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);

  useEffect(() => {
    axios.get(authorUrl).then(res => {
      setAuthor(res.data);
      setResponseMessage(200);
    }).catch(err => {
      console.log("ERROR GETTING AUTHOR INFO");
      setResponseMessage(500);
    })

    axios.get(process.env.REACT_APP_API_URL + "/api/author/" + authorId + "posts/",
      {
        auth: {
          username: props.loggedInUser ? props.loggedInUser.username : "",
          password: props.loggedInUser ? props.loggedInUser.password : "",
        }
      }
    ).then(res => {
      const posts: Post[] = res.data;
      const orderedPosts = posts.reverse();
      setPostEntries(orderedPosts);
    }).catch(err => {
      console.log("ERROR GETTING POSTS");
      setResponseMessage(500);
    })
  }, []);

  const postCards = () => {
    while (!postEntries) {
      return (
        <Card>
          <CardBody>
            <CardTitle tag="h5">LOADING POSTS</CardTitle>
          </CardBody>
        </Card>
      )
    }
    if (postEntries.length == 0) {
      return (
        <Card>
          <CardBody>
            <CardTitle tag="h5">No Posts!</CardTitle>
          </CardBody>
        </Card>
      )
    }
    return (
      postEntries.map((post: Post) => <PostListItem post={post} key={post.id} />)
    )
  };

  if (responseMessage > 299) {
    return (<Container>
      <Alert color="danger">An error occurred! Please try again</Alert>
    </Container>)
  }

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm={2}>
          <Card body className="text-center">
            {/* TODO: maybe add profile pic. uncomment line below */}
            {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
            <CardBody>
              <CardTitle tag="h5">{author.displayName}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">@{props.loggedInUser?.username}</CardSubtitle>
              <CardLink href={author ? author.github : "#"} >GitHub</CardLink>
            </CardBody>
          </Card>
        </Col>
        <Col sm={5}>
          {postCards()}
        </Col>
      </Row>
    </Container>
  );
}