import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Form, Input } from 'reactstrap';
import PostListItem from '../components/PostListItem';
import { Post } from '../types/Post';


// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props:RouteComponentProps) {

  const [userSearch,setUserSearch] = useState('');


  const [postEntries, setPostEntries] = useState<Post[]|undefined>(undefined);

  useEffect(()=>{
    axios.get(process.env.REACT_APP_API_URL + "/api/public-posts/",).then(res => {
      console.log(res.data);
      setPostEntries(res.data);
    }).catch(err => {
      console.error(err);
    });
  },[]);

  function onUserSearchChange(e:any){
    setUserSearch(e.target.value);
  }

  function searchUsers(e:any){
    e.preventDefault();
    props.history.push('/authors/'+userSearch);
  }


  let postListElToDisplay;
  if (postEntries === undefined){
    postListElToDisplay = <p>Loading...</p>;
  } else if (postEntries.length === 0) {
    postListElToDisplay = <p>No Entries Found</p>;
  } else {
    postListElToDisplay = postEntries.map((post:Post)=>
      <PostListItem post={post} key={post._id}/>
    );
  }
  console.log(postListElToDisplay)

  return (
    <Row>
      <Col>
        <Form inline={true} onSubmit={e => searchUsers(e)}>
          <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)}/>
        </Form>
      </Col>
      <Col>
        <h3>Feed</h3>
        {postListElToDisplay}
      </Col>
    </Row>
  );
}