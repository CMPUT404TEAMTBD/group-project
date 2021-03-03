import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom"
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Form, Input, Button } from 'reactstrap';
import CreateEditPostModal from '../components/CreateEditPostModal';
import PostListItem from '../components/PostListItem';
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

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);

  useEffect(()=>{
    axios.get(process.env.REACT_APP_API_URL + "/api/public-posts/",).then(res => {
      console.log(res.data);

      const posts:Post[] = res.data;

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
    ReactDOM.render(<AuthorList url = {{searchURL: URL}}/>, document.getElementById("belowRoot")); 
  }

  function CreatePostModal(){
    return(
      <React.Fragment>
        <Button onClick={()=>setIsCreatePostModalOpen(true)}>Create Post</Button>
        <CreateEditPostModal
          toggle={()=>setIsCreatePostModalOpen(!isCreatePostModalOpen)}
          isModalOpen={isCreatePostModalOpen}
          loggedInUser={props.loggedInUser}
        />
      </React.Fragment>
    )
  }
    

  let postListElToDisplay;
  if (postEntries === undefined){
    postListElToDisplay = <p>Loading...</p>;
  } else if (postEntries.length === 0) {
    postListElToDisplay = <p>No Entries Found</p>;
  } else {
    postListElToDisplay = postEntries.map((post:Post)=>
      <PostListItem post={post} key={post.id}/>
    );
  }
  console.log(postListElToDisplay)

  
  function result(){
    if (userSearch){
      return (
        <>
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
        
        </>
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
      <Col>
        <h3>Feed</h3>
        {/* {result()} */}
        {postListElToDisplay}
      </Col>
      <Col>
        {/* {props.loggedInUser ? <Button onClick={() => props.history.push('/create_post')}>Create Post</Button> : null} */}
        {props.loggedInUser ? CreatePostModal() : null}
      </Col>
    </Row>
  );
}