import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardTitle, Container, Button, CardText, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import AuthorListItem from '../components/AuthorListItem';
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';
var classNames = require('classnames');

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
    <>

      <Row className="justify-content-md-center">
        <Nav tabs light>
          <NavItem>
            <NavLink onClick={() => { toggle('followers') }} className={classNames({ active: activeTab === 'followers' })}>
              <h3>Followers</h3>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => { toggle('following') }} className={classNames({ active: activeTab === 'following' })}>
              <h3>Following</h3>
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="followers">
              <Container fluid>
              <Row>
                <Col>
                  {followers && displayFollowList(followers)}
                </Col>
              </Row>
              </Container>
            </TabPane>
            <TabPane tabId="following">
            <Container fluid>
              <Row>
                <Col>
                  {following && displayFollowList(following)}
                </Col>
              </Row>
              </Container>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
}