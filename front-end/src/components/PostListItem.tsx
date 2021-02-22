import React, { useState } from 'react';
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Post } from '../types/Post';
import PostDetailModal from './PostDetailModal';

interface Props {
  post: Post;
}

export default function PostListItem(props:Props) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => setIsModalOpen(!isModalOpen);

  const post: Post = props.post;
  return (
    <div>
      <Card>
        {/* TODO: Post image here? */}
        {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
        <CardBody onClick={()=>setIsModalOpen(true)} style={{cursor: 'pointer'}}>
          <CardTitle tag="h5">{post.title}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">By: {post.author}</CardSubtitle>
          <CardText>{post.description}</CardText>
        </CardBody>
      </Card>
      <PostDetailModal post={post} toggle={toggle} isOpen={isModalOpen}/>
    </div>
  );
}

