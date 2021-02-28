import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserLogin } from '../types/UserLogin';
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

interface Props {
  loggedInUser: UserLogin | undefined;
}

// https://react-bootstrap.github.io/layout/grid/
export default function AuthorPage(props: Props) {
  const authorId = props.loggedInUser ? props.loggedInUser.authorId + "/" : "";
  const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + authorId;
  const initialInputState = { displayName: undefined, github: undefined };
  const [author, setAuthor] = useState(initialInputState);

  useEffect(() => {
    axios.get(authorUrl).then(res => {
      setAuthor(res.data);
    }).catch(err => {
      console.log("GET ERROR");
    })
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col sm={3}>
          <Card>
            {/* TODO: maybe add profile pic? uncomment line below */}
            {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
            <CardBody>
              <CardTitle tag="h5">{author.displayName}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">@{props.loggedInUser?.username}</CardSubtitle>
              <CardLink href={author ? author.github : "#"} >GitHub</CardLink>
            </CardBody>
          </Card>
        </Col>
        <Col sm={9}>
          <Card>
            {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
            <CardBody>
              <CardTitle tag="h5">RENDER POSTS IN THIS CARD</CardTitle>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}