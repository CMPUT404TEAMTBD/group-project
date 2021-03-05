import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input } from 'reactstrap';
import PostList from '../components/PostList';
import { Post } from '../types/Post';

// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props:any) {

  const [userSearch,setUserSearch] = useState<string>('');
  const [postEntries, setPostEntries] = useState<Post[]|undefined>(undefined);

  useEffect(()=>{
    axios.get(process.env.REACT_APP_API_URL + "/api/public-posts/",).then(res => {
      console.log(res.data);
      const posts: Post[] = res.data;
      setPostEntries(posts);
    }).catch(err => {
      console.error(err);
    });
  },[]);

  function onUserSearchChange(e:any){
    setUserSearch(e.target.value);
  }

  //search for authors with the same displayName
  function searchUsers(e:any){
    e.preventDefault();
    props.history.push(`/authors/${userSearch}`);
  }
  
  return (
    <Row>
      <Col>
        <Form inline={true} onSubmit={e => searchUsers(e)}>
          <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)}/>
        </Form>
      </Col>
      {<PostList postEntries={postEntries} setPostEntries={setPostEntries} loggedInUser={props.loggedInUser} />}
    </Row>
  );
}