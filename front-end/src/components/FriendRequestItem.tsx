import React, { useState } from 'react';
import { Button, Card, CardBody, CardImg, CardLink, CardSubtitle, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import { FriendRequest } from '../types/FriendRequest';

interface Props {
    friendRequest: FriendRequest;
    // removeFromList: Function;
}

// TODO: make accept and reject buttons work
// Accept = PUT to /:author_id/followers/:foreign_id
// Reject = DELETE from inbox?
export default function FriendRequestItem(props: Props) {
    const friendRequest = props.friendRequest;

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
            <Button color="success">Accept</Button>
            <Button color="danger">Reject</Button>
          </Col>
          </Row>
          </Container>
        </CardBody>
      </Card>
        // </>
    )
}