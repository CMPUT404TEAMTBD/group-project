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
import { Author } from '../types/Author';

interface Props {
  loggedInUser: UserLogin | undefined;
}

/*
  AuthorPage will render and display an author's profile - this includes information
  about their user account and all the posts they have made
*/
export default function AuthorPage(props: Props) {
  // if logged in, assign authorUrl
  const authorId = props.loggedInUser ? props.loggedInUser.authorId + "/" : "";
  const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + authorId;
  const [author, setAuthor] = useState<Author|undefined>(undefined);
  const [responseMessage, setResponseMessage] = useState(100);
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);

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

    axios.get(process.env.REACT_APP_API_URL + "/api/author/" + authorId + "posts/",
      {
        auth: { // authenticate the GET request
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

  /* display a card to show posts loading, otherwise show that the user either has
    no posts or display all posts */
  const postCards = () => {
    if (!postEntries) {
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
      postEntries.map((post: Post) => <PostListItem post={post} key={post.id} isEditable={true} loggedInUser={props.loggedInUser} />)
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
              <CardTitle tag="h5">{author?.displayName}</CardTitle>
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