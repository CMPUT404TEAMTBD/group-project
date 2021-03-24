import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardTitle, Container, Button, CardText, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import AuthorListItem from '../components/AuthorListItem';
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';

interface Props extends RouteComponentProps<MatchParams>{
  loggedInUser: UserLogin | undefined,
  activeTab: string,
}

interface MatchParams {
  authorId: string;
}
/**
 * Render list of search results when searching for an author by display name
 * @param props 
 */
export default function FollowersPage(props: Props) {
  const [followers, setFollowers] = useState<Author[] | undefined>(undefined);
  const [following, setFollowing] = useState<Author[] | undefined>(undefined);

  // get all followers and following
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId + "/followers").then(res => {
      const followersList: Author[] = res.data.items;
      setFollowers(followersList);
    });

    // TODO: after following API endpoint is finished, just uncomment the axios request below
    // axios.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId + "/following").then(res => {
    //   const followingList: Author[] = res.data.items;
    //   setFollowing(followingList);
    // });

  }, []);

  const [activeTab, setActiveTab] = useState(props.activeTab);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
    props.history.push("/author/" + props.loggedInUser?.authorId + "/" + tab);
  }

  return (
    <Container fluid>

      <Row className="justify-content-md-center">
        <Nav tabs>
          <NavItem>
            <NavLink onClick={() => { toggle('followers') }} >
              <h2>Followers</h2>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => { toggle('following') }} >
              <h2>Following</h2>
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm="12" md={{ size: 6 }}>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="followers">
              <Row>
                <Col sm="12">
                  {followers?.length !== 0 ?
                    followers?.map((follower: Author) => <AuthorListItem author={follower} loggedInUser={props.loggedInUser}></AuthorListItem>) :
                    <Card body className="text-center"><CardBody><CardTitle tag="h5" >You have no followers :(</CardTitle></CardBody></Card>
                  }
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="following">
              <Row>
                <Col sm="12">
                  {following?.length !== 0 ?
                    following?.map((followee: Author) => <AuthorListItem author={followee} loggedInUser={props.loggedInUser}></AuthorListItem>) :
                    <Card body className="text-center"><CardBody><CardTitle tag="h5" >You're not following anyone!</CardTitle></CardBody></Card>
                  }
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Container>
  );
}