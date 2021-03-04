import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom"
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import PostList from '../components/PostList';
import { Post } from '../types/Post';
import AuthorList from "../components/AuthorList"
interface userProps {
  url: string;
  displayName: string;
  id: string;
  github: string;
}

// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props:any) {

  const [userSearch,setUserSearch] = useState<userProps>();
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
    const URL = process.env.REACT_APP_API_URL + "/api/authors/";
    ReactDOM.render(<AuthorList url = {{searchURL: URL}} displayName = {{searchDisplayName:userSearch}} />, document.getElementById("root")) 
  }
  
  function result(){
    if (userSearch){
      return (
        <div>
          <p>
            {userSearch['id']}
          </p>
          <p>
            {userSearch['displayName']}
          </p>
          <p>
            {userSearch['url']}
          </p>
          <p>
            {userSearch['github']}
          </p>
          
        </div>
      )
      
    }

    else{
      <p>
        No result
      </p>
    }

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