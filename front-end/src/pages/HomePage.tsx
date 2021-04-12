import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Label, FormGroup } from 'reactstrap';
import PostList from '../components/PostList';
import { Post } from '../types/Post';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import AuthorSearchBar from '../components/AuthorSearchBar';
import * as Icons from '../assets/Icons';

/**
 * Renders the homepage which will display a stream of public posts
 * @param props 
 */
// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props: any) {

  const [userSearch, setUserSearch] = useState<string>('');
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);

  // get all public posts
  useEffect(() => {

    if (!props.loggedInUser) {
      props.history.push('/login')
    }
    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/public-posts/", props.loggedInUser).then((res: any) => {
      const posts: Post[] = res.data;
      setPostEntries(posts);
    }).catch((err: any) => {
      console.error(err);
    });
  }, []);

  // search for authors with the same displayName
  function searchUsers(e: any) {
    e.preventDefault();
    props.history.push(`/authors/${userSearch}`);
  }

  return (
    <>
      <Row className="justify-content-md-center">
        {props.loggedInUser && (
          <Form style={{ width: "80%" }} onSubmit={(e) => searchUsers(e)}>
            <FormGroup row>
              <Label for="Author Search" sm={1}>
                {Icons.searchIcon}
              </Label>
              <Col>
                <AuthorSearchBar loggedInUser={props.loggedInUser} />
              </Col>
            </FormGroup>
          </Form>
        )}
      </Row>
      <Row>
        <Col className="justify-content-md-center">
          {
            <PostList
              postEntries={postEntries}
              setPostEntries={setPostEntries}
              loggedInUser={props.loggedInUser}
              isResharable={true}
              displayCreateButton={true}
            />
          }
        </Col>
      </Row>
    </>
  );
}