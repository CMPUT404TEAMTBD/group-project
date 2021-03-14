import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardImg, CardLink, CardSubtitle, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import { Author } from '../types/Author';
import { FriendRequest } from '../types/FriendRequest';
import { UserLogin } from '../types/UserLogin';

interface Props {
  loggedInUser: UserLogin;
  friendRequest: FriendRequest;
}

// TODO: update/remove the friend request item from the list when you follow back/accept
export default function FriendRequestItem(props: Props) {
  const friendRequest = props.friendRequest;

  function followBack(requester: Author) {
    // TODO: follow back
    console.log("followed back: " + requester.displayName);
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
            <Col xs="6">
              <CardTitle tag="h5" >{friendRequest.actor.displayName}</CardTitle>
              <CardSubtitle tag="h6">
                From: <CardLink href={friendRequest.actor.host}>{friendRequest.actor.host}</CardLink>
              </CardSubtitle>
              <Button color="success" onClick={() => followBack(friendRequest.actor)}>Befriend</Button>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
    // </>
  )
}