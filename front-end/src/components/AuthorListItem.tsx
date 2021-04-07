import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, CardImg, CardTitle, Button, CardLink, CardSubtitle } from 'reactstrap';
import { Author } from "../types/Author";
import { UserLogin } from '../types/UserLogin';
import FollowRequestButton from './FriendRequestButton';
import { isValidGithub } from '../helpers/GithubHelper';
import * as Icons from '../assets/Icons';

interface Props {
  author: Author;
  loggedInUser?: UserLogin;
}

/**
 * Author list item component to show an individual author
 * @param props 
 */
export default function AuthorListItem(props: Props) {
  const isFollowerUrl = `${props.author.host}api/author/${props.author.id}/followers/${props.loggedInUser?.authorId}/`;

  const [isFollower, setIsFollower] = useState<boolean>(false);

  useEffect(() => {
    // get whether user is follower of author
    if (props.author.id !== props.loggedInUser?.authorId) {
      AxiosWrapper.get(isFollowerUrl, props.loggedInUser).then((res: any) => {
        setIsFollower(true);
      }).catch((err: any) => {
        setIsFollower(false);
      })
    }
  }, []);

  const displayFollowButton = () => {
    if (props.loggedInUser && props.author.id !== props.loggedInUser?.authorId) {
      return <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={props.author} isFollower={isFollower} setIsFollower={setIsFollower} /> 
    }
  }

  return (
    <Card>
    <CardBody>
      <Container fluid>
        <Row>
          <Col xs="2">
            { !isValidGithub(props.author.github) ?
              <CardBody>{Icons.defaultProfilePic}</CardBody> :
              <CardImg top src={props.author.github + ".png"} alt="Profile Pic" />
            }
          </Col>
          <Col xs="6">
            <CardTitle tag="h3" ><Link to={{ pathname: `/author/${props.author.id}` }}>{props.author.displayName}</Link></CardTitle>
            <CardSubtitle tag="h5">
              {displayFollowButton()}
            </CardSubtitle> 
          </Col>
        </Row>
      </Container>
    </CardBody>
  </Card>
  )
}
