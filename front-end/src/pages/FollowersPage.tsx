import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Container } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import AuthorListItem from '../components/AuthorListItem';
import { Author } from '../types/Author';

/**
 * Render list of search results when searching for an author by display name
 * @param props 
 */
export default function FollowersPage(props: any) {
  const [followers, setFollowers] = useState<Author[] | undefined>(undefined);

  // get all followers
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/followers").then(res => {
      const followersList: Author[] = res.data.items;
      setFollowers(followersList);
    });
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col sm="12" md={{ size: 6 }}>
            <h2>Followers</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm="12" md={{ size: 6 }}>
          {followers?.length !== 0 ?
            followers?.map((follower: Author) => <AuthorListItem author={follower} loggedInUser={props.loggedInUser}></AuthorListItem>) :
            <Card body className="text-center"><CardBody><CardTitle tag="h5" >No Friend Requests :(</CardTitle></CardBody></Card>
          }

        </Col>
      </Row>
    </Container>
  );
}