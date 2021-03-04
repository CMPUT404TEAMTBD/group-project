import React, { useState } from 'react';
import { Button, Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';
import PostContentEl from './PostContentEl';
import CreateEditPostModal from './CreateEditPostModal';
import DeletePostModal from './DeleteModal';
import PostDetailModal from './PostDetailModal';

interface Props {
  post: Post;
  // true if the user can edit this post
  isEditable?: boolean;
  // true if the user can delete the post
  isDeletable?: boolean;
  loggedInUser?: UserLogin;
  removeFromFeed: Function;
}

export default function PostListItem(props:Props) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggle = () => setIsModalOpen(!isModalOpen);
  const toggleEdit = () => setIsEditModalOpen(!isEditModalOpen);
  const toggleDelete = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const EditCardLink = () => props.loggedInUser !== undefined && props.isEditable ? <CardLink onClick={()=>{setIsEditModalOpen(true);console.log("DDSDSSDF")}}>Edit</CardLink> : null
  const DeleteCardLink = () => props.loggedInUser !== undefined && props.isDeletable ? <CardLink onClick={()=>{setIsDeleteModalOpen(true);}}>Delete</CardLink> : null

  if(props.isEditable || props.isDeletable){
    if(!props.loggedInUser){
      console.error('You must supply the logged in user if you are editing or deleting!')
    }
  }

  const post: Post = props.post;
  return (
    <div>
      <Card>
        {/* TODO: Post image here? */}
        {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
        <CardBody>
          <CardTitle onClick={()=>setIsModalOpen(true)} tag="h5" style={{cursor: 'pointer'}}>{post.title}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">By: {post.author.displayName}</CardSubtitle>
          <CardText onClick={()=>setIsModalOpen(true)}>{post.description}</CardText>
          <PostContentEl postContent={post} isPreview={true}/>
          {EditCardLink()}
          {DeleteCardLink()}
        </CardBody>
      </Card>
      <PostDetailModal post={post} toggle={toggle} isOpen={isModalOpen}/>
      {props.loggedInUser !== undefined && props.isEditable? <CreateEditPostModal 
                                            loggedInUser={props.loggedInUser}
                                            toggle={toggleEdit}
                                            isModalOpen={isEditModalOpen}
                                            editFields={props.post}/> : null}
      {props.loggedInUser !== undefined ? <DeletePostModal 
                                            loggedInUser={props.loggedInUser}
                                            isModalOpen={isDeleteModalOpen}
                                            toggle={toggleDelete}
                                            postID={props.post.id}
                                            removeFromFeed={props.removeFromFeed}/> : null}
    </div>
  );
}

