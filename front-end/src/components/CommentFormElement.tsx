import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useState } from "react";
import { Alert, Button, Card, CardTitle, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UserLogin } from "../types/UserLogin";
import { Author } from '../types/Author';
import { PostComment } from '../types/PostComment';

interface Props {
  loggedInUser: UserLogin | undefined,
  postId: string,
  postAuthor: Author,
}

/**
 * Delete Post modal, confirmation to delete post as well as removing from list on success
 * @param props 
 */
export default function CommentFormElement(props: Props) {

  const [showError, setShowError] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commenter, setCommenter] = useState<Author | undefined>(undefined);
  const loggedInUserUrl = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser?.authorId}/`;

  function addComment(e: any) {
    e.preventDefault();

    // Send GET request to get commenter's info
    AxiosWrapper.get(loggedInUserUrl, props.loggedInUser).then((res: any) => {
      if (res.status === 200) {
        const author: Author = res.data;
        setCommenter(author);
      }
    }).then(() => {
      if (commenter) {
        const comment: PostComment = {
          author: commenter,
          comment: commentContent,
        }
        // Send POST request to comment on a post
        AxiosWrapper.post(`${props.postAuthor.host}api/author/${props.postAuthor.id}/posts/${props.postId}/comments/`, comment, props.loggedInUser)
          .then((res: any) => {
            handleRes(res)
          }).catch((err: any) => {
            setShowError(true)
          });
      }
    });
  }

  function handleRes(res: AxiosResponse) {
    if (res.status === 201) {
      // Successfully commented on post, so clear the text box
      setCommentContent("");
      // TODO: append the new comment to the list?
    } else if (res.status >= 400) {
      // Error in commenting on post
      setShowError(true)
    }
  }

  if (!props.loggedInUser) {
    return (
      <Card body className="text-center">
        <CardTitle>Log in to make and see comments!</CardTitle>
      </Card>
    )
  }

  return (
    <Card body className="text-center">
      {showError ? <Alert>Could not add comment :(</Alert> : null}
      <Form onSubmit={e => addComment(e)}>
        <FormGroup class="input-group flex-fill">
          <Input type="textarea" rows="4" name="Comment" placeholder="Write a comment! 🗣" onChange={(e: any) => setCommentContent(e.target.value)} value={commentContent} />
        </FormGroup>
        <FormGroup>
          <Button>Comment</Button>
        </FormGroup>
      </Form>
    </Card>
  )
}