import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Row, Col } from 'reactstrap';
import PostDetailModal from '../components/PostDetailModal';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';


interface Props extends RouteComponentProps<MatchParams>{
  loggedInUser: UserLogin|undefined;
}

interface MatchParams {
  postId: string
}

/**
 * Renders a post detail
 * @param props 
 */
export default function PostDetailPage(props: Props) {
  const [postEntry, setPostEntry] = useState<Post | undefined>(undefined);

  const {postId} = props.match.params;
  // get post
  useEffect(() => {
    let getPromise;
    if (props.loggedInUser) {
      getPromise = AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/`, props.loggedInUser);
    } else {
      getPromise = AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api${props.location.pathname}`, props.loggedInUser);
    }
    getPromise.then((res: any) => {
      const post: Post = res.data;
      setPostEntry(post);
    }).catch((err: any) => {
      console.error(err);
    });
  }, []);

  // Go back to home page
  function redirectOnToggle(){
    props.history.push("/");
  }

  return (
    <Row>
      <Col>
        {postEntry ? <PostDetailModal post={postEntry} toggle={redirectOnToggle} isOpen={true} loggedInUser={props.loggedInUser}/>:<p>Cannot load the post!</p>}
      </Col>
    </Row>
  );
}