import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';

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
      <ModalBody>
        <h6 className="mb-2 text-muted">By: {post.author}</h6>
        <div>
          <p>{post.description}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        
      </ModalFooter>
    </Modal>
  );
}

