import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { AxiosResponse } from 'axios';
import { useState } from "react";
import { Alert, Button, Card, CardTitle, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UserLogin } from "../types/UserLogin";
import { Author } from '../types/Author';
import { PostComment } from '../types/PostComment';

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
    }).then(() => {
      if (commentAuthor) {
        const comment = {
          "author": commentAuthor,
          "comment": commentContent,
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