import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { AxiosResponse } from 'axios';
import React, { useState } from "react";
import { Alert, Button, Card, CardTitle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UserLogin } from "../types/UserLogin";
import { Author } from '../types/Author';
import { PostComment } from '../types/PostComment';
import { PostContentType } from '../types/Post';

interface Props {
  loggedInUser: UserLogin | undefined,
  postId: string,
  postAuthor: Author,
  commentList: PostComment[] | undefined,
  setCommentList: Function,
}

/**
 * Delete Post modal, confirmation to delete post as well as removing from list on success
 * @param props 
 */
export default function CommentFormElement(props: Props) {

  const [showError, setShowError] = useState(false);
  const [commentContent, setCommentContent] = useState<string>();
  const [commentAuthor, setCommentAuthor] = useState<Author | undefined>(undefined);
  const [contentType, setContentType] = useState<PostContentType>(PostContentType.PLAIN_TEXT);
  const loggedInUserUrl = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser?.authorId}/`;

  if (!props.loggedInUser) {
    return (
      <Card body className="text-center">
        <CardTitle>Log in to make and see comments!</CardTitle>
      </Card>
    )
  }

  function addComment(e: any) {
    e.preventDefault();

    if (!commentContent) {
      alert("Can't make a blank comment!");
      return;
    }

    // Send GET request to get commenter's info
    AxiosWrapper.get(loggedInUserUrl, props.loggedInUser).then((res: any) => {
      if (res.status === 200) {
        const author: Author = res.data;
        setCommentAuthor(author);
        return author;
      }
    }).then((author: Author) => {
      if (author) {
        const comment:PostComment = {
          author,
          comment: commentContent,
          contentType
        }
        // Send POST request to comment on a post
        AxiosWrapper.post(`${props.postAuthor.host}api/author/${props.postAuthor.id}/posts/${props.postId}/comments/`, comment, props.loggedInUser)
          .then((res: any) => {
            handleRes(res, res.data);
          }).catch((err: any) => {
            setShowError(true)
          });
      }
    });
  }

  function handleRes(res: AxiosResponse, comment: PostComment) {
    if (res.status === 201) {
      // Successfully commented on post, so clear the text box
      setCommentContent("");
      if (props.commentList !== undefined) {
        props.setCommentList([comment, ...props.commentList])
      }
    } else if (res.status >= 400) {
      // Error in commenting on post
      setShowError(true)
    }
  }

  return (
    <Card body className="text-center">
      {showError ? <Alert>Could not add comment :(</Alert> : null}
      <Form onSubmit={e => addComment(e)}>
        <FormGroup>
          <Label for="Content Type">Content Type</Label>
          <select name="Content Type" onChange={e => setContentType(e.target.value as PostContentType)} value={contentType}>
            <option value={PostContentType.PLAIN_TEXT}>text/plain</option>
            <option value={PostContentType.MARKDOWN}>text/markdown</option>
            {/* Enable if you hate inter-op */}
            {/* <option value={PostContentType.APPLICATION}>application/base64</option>
            <option value={PostContentType.PNG}>image/png</option>
            <option value={PostContentType.JPEG}>image/jpeg</option> */}
          </select>
        </FormGroup>
        <FormGroup className="input-group flex-fill">
          <Input type="textarea" rows="4" name="Comment" placeholder="Write a comment! 🗣" onChange={(e: any) => setCommentContent(e.target.value)} value={commentContent} />
        </FormGroup>
        <FormGroup>
          <Button>Comment</Button>
        </FormGroup>
      </Form>
    </Card>
  )
}