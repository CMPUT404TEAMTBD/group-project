import React, { useEffect, useState } from 'react';
import { Col, Button, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Card, CardTitle, Container, Row } from 'reactstrap';
import { UserLogin } from '../types/UserLogin';
import CreateEditPostModal from '../components/CreateEditPostModal';
import PostListItem from '../components/PostListItem';
import { Post } from '../types/Post';
import { Author } from '../types/Author';
import { PostComment } from '../types/PostComment';
import CommentListItem from './CommentListItem';
import { AxiosWrapper } from '../helpers/AxiosWrapper';

interface Props {
  postId: string,
  postAuthor: Author,
  loggedInUser: UserLogin | undefined,
  setUpdateComment: Function,
  updateComment: boolean,
}

/**
 * Post list component to show list of posts
 * @param props 
 */
export default function CommentList(props: Props) {

  const [commentList, setCommentList] = useState<PostComment[] | undefined>(undefined);

  function fetchComments() {
    AxiosWrapper.get(`${props.postAuthor.url}posts/${props.postId}/comments/`, props.loggedInUser).then((res: any) => {
      // TODO: filters for friend posts?
      const comments: PostComment[] = res.data;
      // Reverse the posts so that they are in order (from newest to oldest).
      setCommentList(comments.reverse());
    }).catch((err: any) => {
      console.error(err);
    });
  }

  useEffect(() => {
    fetchComments();
  }, []);

  if (props.updateComment) {
    fetchComments();
    props.setUpdateComment(false);
  }

  return (
    <Container fluid>
      <Col>
        {commentList && commentList.map((c: PostComment) => <CommentListItem comment={c} />)}
      </Col>
    </Container>
  );
}
