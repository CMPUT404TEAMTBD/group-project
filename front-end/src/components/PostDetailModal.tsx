import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { PostComment } from '../types/PostComment';
import { UserLogin } from '../types/UserLogin';
import CommentFormElement from './CommentFormElement';
import CommentList from './CommentList';
import PostContent from './PostContentEl';
import { getDateString } from '../helpers/DateHelper';
import { AxiosWrapper } from '../helpers/AxiosWrapper';

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

  const [commentList, setCommentList] = useState<PostComment[] | undefined>(undefined);

  function fetchComments() {
    AxiosWrapper.get(`${post.author.url}posts/${post.id}/comments/`, props.loggedInUser).then((res: any) => {
      const comments: PostComment[] = res.data;
      // Reverse the comments so that they are in order (from newest to oldest).
      setCommentList(comments.reverse());
    }).catch((err: any) => {
      console.error(err);
    });
  }

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle} size="lg">
      <ModalHeader toggle={props.toggle}>{post.title}</ModalHeader>
      <ModalBody style={{wordWrap: 'break-word'}}>
        <h6 className="mb-2 text-muted">By: {post.author.displayName}</h6>
        <span className="mb-2 text-muted">{getDateString(post)}</span>
        <div>
          <p>{post.description}</p>
          <PostContent postContent={post} isPreview={false}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <CommentFormElement loggedInUser={props.loggedInUser} postId={post.id} postAuthor={post.author} commentList={commentList} setCommentList={setCommentList} />
      </ModalFooter>
      {props.loggedInUser && <ModalFooter><CommentList commentList={commentList} /></ModalFooter>}
    </Modal>
  );
}

