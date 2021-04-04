import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Nav, NavItem, NavLink, TabContent, Card, CardTitle, TabPane, Container, Label, FormGroup } from 'reactstrap';
import LikesFeed from '../components/LikesFeed';
import PostList from '../components/PostList';
import { Like } from '../types/Like';
import { Post } from '../types/Post';


/**
 * Renders the homepage which will display a stream of public posts
 * @param props 
 */
// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props: any) {

  const [userSearch, setUserSearch] = useState<string>('');
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const searchIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);

  // get all public posts
  useEffect(() => {
    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/public-posts/", props.loggedInUser).then((res: any) => {
      const posts: Post[] = res.data;
      setPostEntries(posts);
    }).catch((err: any) => {
      console.error(err);
    });
  }, []);

  // update on search
  function onUserSearchChange(e: any) {
    setUserSearch(e.target.value);
  }

  // search for authors with the same displayName
  function searchUsers(e: any) {
    e.preventDefault();
    props.history.push(`/authors/${userSearch}`);
  }

  return (
    <>
      <Row className="justify-content-md-center">
      <Form style={{width: "80%"}} onSubmit={e => searchUsers(e)}>
      <FormGroup row>
      <Label for="Author Search" sm={1}>{searchIcon}</Label>
        <Col>
        <Input type="text" name="Author Search" placeholder={"Search Authors"} onChange={e => onUserSearchChange(e)} />
        </Col>
      </FormGroup>
      </Form>
      </Row>
        <Row>
          <Col className="justify-content-md-center">
          {<PostList postEntries={postEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} isResharable={true}/>}
          </Col>
        </Row>
    </>
  );
}