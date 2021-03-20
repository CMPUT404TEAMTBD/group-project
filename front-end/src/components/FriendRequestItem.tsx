import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardImg, CardLink, CardSubtitle, CardText, CardTitle, Col, Container, Row } from 'reactstrap';
import { Follow } from '../types/Follow';
import { UserLogin } from '../types/UserLogin';
import FollowRequestButton from '../components/FriendRequestButton';

interface Props {
  loggedInUser: UserLogin;
  friendRequest: Follow;
}

// TODO: update/remove the friend request item from the list when you follow back/accept
export default function FriendRequestItem(props: Props) {
  const friendRequest = props.friendRequest;
  const requester = props.friendRequest.actor;
  const [isFollower, setIsFollower] = useState<boolean>(false);

  const displayFollowButton = () => {
    if (props.loggedInUser && requester?.id !== props.loggedInUser.authorId) {
      return <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={requester} isFollower={isFollower} setIsFollower={setIsFollower} />
    }
  }

  return (
    <Card>
      <CardBody>
        <Container fluid>
          <Row>
            <Col xs="2">
              <CardImg top width="20%" src={friendRequest.actor.github + ".png"} alt="card image cap" />
            </Col>
            <Col xs="6">
              <CardTitle tag="h4" >{friendRequest.actor.displayName}</CardTitle>
              <CardSubtitle tag="h5">
                From: <CardLink href={friendRequest.actor.host}>{friendRequest.actor.host}</CardLink>
              </CardSubtitle>
              {displayFollowButton()}
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
  )
}