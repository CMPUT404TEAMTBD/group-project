import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardImg, CardLink, CardSubtitle, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import { Author } from '../types/Author';
import { FriendRequest } from '../types/FriendRequest';
import { UserLogin } from '../types/UserLogin';

interface Props {
    loggedInUser: UserLogin;
    friendRequest: FriendRequest;
    // removeFromList: Function;
}

// TODO: make accept and reject buttons work
// Accept = PUT to /:author_id/followers/:foreign_id
// Reject = DELETE from inbox?
export default function FriendRequestItem(props: Props) {
    const friendRequest = props.friendRequest;

    function acceptFriendRequest(requester: Author) {
      const foreignAuthorUri = requester.id.split("/");
      const foreignId = foreignAuthorUri[4]; // i dont like this being hardcoded
      axios.put(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/followers/" + foreignId + "/",
        requester, {
          auth: {
            username: props.loggedInUser.username,
            password: props.loggedInUser.password,
          },
        }).then(res => {
          if (res.status >= 400) {
            console.log("ERRRRRr");
          } else if (res.status === 201) {
            // TODO:
            // if OK then remove the friend request from the list here
          }
        }).catch(err => {
          console.log("ERRRR");
        })
    }
  
    return (
        // <>
        <Card>
        <CardBody>
          <Container fluid>
          <Row>
          <Col xs="2">
          <CardImg top width="20%" src={friendRequest.actor.github + ".png"} alt="card image cap" />
          </Col>
          <Col xs="7">
          <CardTitle tag="h5" >{friendRequest.actor.displayName}</CardTitle>
          <CardSubtitle tag="h6">From: {friendRequest.actor.host}</CardSubtitle>
          </Col>
          <Col xs="3">
            <Button color="success" onClick={() => acceptFriendRequest(friendRequest.actor)}>Accept</Button>
            <Button color="danger">Reject</Button>
          </Col>
          </Row>
          </Container>
        </CardBody>
      </Card>
        // </>
    )
}