import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';
import CommentFormElement from './CommentFormElement';
import CommentList from './CommentList';
import PostContent from './PostContentEl';

interface Props {
  post: Post;
  toggle: any;
  isOpen: boolean;
  loggedInUser: UserLogin | undefined;
}

/**
 * Post Details Modal to show the details of an individual post on a stream
 * @param props 
 */
export default function PostDetailModal(props:Props) {
  const post: Post = props.post;
  

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle} size="lg">
      <ModalHeader toggle={props.toggle}>{post.title}</ModalHeader>
      <ModalBody style={{wordWrap: 'break-word'}}>
        <h6 className="mb-2 text-muted">By: {post.author.displayName}</h6>
        <div>
          <p>{post.description}</p>
          <PostContent postContent={post} isPreview={false}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <CommentFormElement loggedInUser={props.loggedInUser} postId={post.id} postAuthor={post.author} />
      </ModalFooter>
      <ModalFooter><CommentList postId={post.id} postAuthor={post.author} /></ModalFooter>
    </Modal>
  );
}

