import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { UserLogin } from '../types/UserLogin';
import CreateEditPostModal from '../components/CreateEditPostModal';
import PostListItem from '../components/PostListItem';
import { Post } from '../types/Post';

interface Props {
  postEntries?: Post[];
  setPostEntries: Function;
  loggedInUser?: UserLogin;
}

/**
 * Post list component to show list of posts
 * @param props 
 */
export default function PostList(props:Props) {

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);

  // Add new post to PostList
  function prependToFeed(post:Post){
    if(props.postEntries !== undefined){
      props.setPostEntries([post, ...props.postEntries])
    }
  }
    
  // Remove post with id postID from list
  function removeFromFeed(postID: string) {
    if(props.postEntries !== undefined){
      props.setPostEntries(props.postEntries.filter((p: Post) => { return postID !== p.id}))
    }
  }

  // Create post button
  function CreatePostModal(){
    return(
      <React.Fragment>
        <Button onClick={()=>setIsCreatePostModalOpen(true)}>Create Post</Button>
        <CreateEditPostModal
          toggle={()=>setIsCreatePostModalOpen(!isCreatePostModalOpen)}
          isModalOpen={isCreatePostModalOpen}
          loggedInUser={props.loggedInUser as UserLogin}
          prependToFeed={prependToFeed}
        />
      </React.Fragment>
    )
  }

  let postListElToDisplay;
  if (props.postEntries === undefined){
    postListElToDisplay = <p>Loading...</p>;
  } else if (props.postEntries.length === 0) {
    postListElToDisplay = <p>No Entries Found</p>;
  } else {
    postListElToDisplay = props.postEntries.map((post:Post)=>
      <PostListItem post={post} key={post.id} isEditable={true} isDeletable={true} loggedInUser={props.loggedInUser} removeFromFeed={removeFromFeed}/>
    );
  }
  console.log(postListElToDisplay);

  return (
    <>
      <Col>
        <h3>Feed</h3>
        {postListElToDisplay}
      </Col>
      <Col>
        {props.loggedInUser ? CreatePostModal() : null}
      </Col>
    </>
    );
}

