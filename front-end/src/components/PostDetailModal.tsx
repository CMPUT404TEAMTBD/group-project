import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { isImage } from '../helpers/ImageHelper';

interface Props {
  post: Post;
  toggle: any;
  isOpen: boolean;
}

export default function PostListItem(props:Props) {
  const post: Post = props.post;

  function Content() {
    if (isImage(post)) {
      return <img src={post.content}/>
    } else {
      return <p>{post.content}</p>
    }
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>{post.title}</ModalHeader>
      <ModalBody>
        <h6 className="mb-2 text-muted">By: {post.author.displayName}</h6>
        <div>
          <p>{post.description}</p>
          <Content/>
        </div>
      </ModalBody>
      <ModalFooter>
        
      </ModalFooter>
    </Modal>
  );
}

