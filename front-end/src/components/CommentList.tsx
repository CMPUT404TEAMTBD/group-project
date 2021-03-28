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
  postId: string;
  postAuthor: Author;
  loggedInUser?: UserLogin;
}

/**
 * Post list component to show list of posts
 * @param props 
 */
export default function CommentList(props: Props) {
  console.log("COMMENT LIST")

  const [commentList, setCommentList] = useState<PostComment[] | undefined>(undefined);

  useEffect(() => {
    AxiosWrapper.get(`${props.postAuthor.url}posts/${props.postId}/comments/`, props.loggedInUser).then((res: any) => {
      // TODO: filters for friend posts?
      const comments: PostComment[] = res.data;
      // Reverse the posts so that they are in order (from newest to oldest).
      setCommentList(comments.reverse());
    }).catch((err: any) => {
      console.error(err);
    });
    const comment1: PostComment = {
      type: "comment",
      author: {
        displayName: "god",
        github: "https://github.com/god",
        id: "74f87354-4b60-4087-9100-f081fb7b64fe",
        type: "author",
        url: "http://localhost:8000/api/author/74f87354-4b60-4087-9100-f081fb7b64fe/",
        host: "http://localhost:8000/"
      },
      comment: "comment 1111111111"
    }
    const comment2: PostComment = {
      type: "comment",
      author: {
        displayName: "god",
        github: "https://github.com/god",
        id: "74f87354-4b60-4087-9100-f081fb7b64fe",
        type: "author",
        url: "http://localhost:8000/api/author/74f87354-4b60-4087-9100-f081fb7b64fe/",
        host: "http://localhost:8000/"
      },
      comment: "22222222 comment 2222222222"
    }
    const test: PostComment[] = [comment1, comment2];
    console.log(test);
    setCommentList(test);
  }, []);

  return (
    <>
      <Col>
        {commentList && commentList.map((c: PostComment) => <CommentListItem comment={c} />)}
      </Col>
    </>
  );
}

