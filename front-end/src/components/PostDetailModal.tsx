import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import PostContent from './PostContentEl';

interface Props {
  post: Post;
  toggle: any;
  isOpen: boolean;
}

export default function PostListItem(props:Props) {
  const post: Post = props.post;

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>{post.title}</ModalHeader>
      <ModalBody style={{wordWrap: 'break-word'}}>
        <h6 className="mb-2 text-muted">By: {post.author.displayName}</h6>
        <div>
          <p>{post.description}</p>
          <PostContent postContent={post} isPreview={false}/>
        </div>
      </ModalBody>
      <ModalFooter>
        
      </ModalFooter>
    </Modal>
  );
}

