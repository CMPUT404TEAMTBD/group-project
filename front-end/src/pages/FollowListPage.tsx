import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardTitle, Container, Button, CardText, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AuthorListItem from '../components/AuthorListItem';
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';

interface Props extends RouteComponentProps<MatchParams> {
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
export default function FollowListPage(props: Props) {
  const [followers, setFollowers] = useState<Author[] | undefined>(undefined);
  const [following, setFollowing] = useState<Author[] | undefined>(undefined);

  // get all followers and following
  useEffect(() => {
    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId + "/followers/", props.loggedInUser).then((res: any) => {
      console.log(res.data.items)
      const followersList: Author[] = res.data.items;
      setFollowers(followersList);
    });

    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId + "/following/", props.loggedInUser).then((res: any) => {
      console.log(res.data)
      const followingList: Author[] = res.data.items;
      setFollowing(followingList);
    });

  }, []);

  const [activeTab, setActiveTab] = useState(props.activeTab);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
    props.history.push("/author/" + props.loggedInUser?.authorId + "/" + tab);
  }

  const displayFollowList = (list: Author[]) => {
    if (list && list.length > 0) {
      return (<>
        {list.map((auth: Author) => <AuthorListItem author={auth} loggedInUser={props.loggedInUser}></AuthorListItem>)}
      </>)
    }
    return <Card body className="text-center"><CardBody><CardTitle tag="h5" >No authors to show :(</CardTitle></CardBody></Card>;
  };

  return (
    <Container fluid>

      <Row className="justify-content-md-center">
        <Nav tabs>
          <NavItem>
            <NavLink onClick={() => { toggle('followers') }} className="mb-2 text-muted">
              <h2>Followers</h2>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => { toggle('following') }} className="mb-2 text-muted">
              <h2>Following</h2>
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm="12" md={{ size: 6 }}>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="followers">
              <Container fluid>
              <Row>
                <Col sm="12">
                  {followers && displayFollowList(followers)}
                </Col>
              </Row>
              </Container>
            </TabPane>
            <TabPane tabId="following">
            <Container fluid>
              <Row>
                <Col sm="12">
                  {following && displayFollowList(following)}
                </Col>
              </Row>
              </Container>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Container>
  );
}