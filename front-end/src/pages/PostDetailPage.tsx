import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useParams } from 'react-router-dom';
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
      getPromise = AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`);
    }
    else {
      getPromise = AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/posts/${props.location.pathname}`,);
    }
    getPromise.then(res => {
      const post: Post = res.data;
      setPostEntry(post);
    }).catch(err => {
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
        {postEntry ? <PostDetailModal post={postEntry} toggle={redirectOnToggle} isOpen={true}/>:<p>Cannot load the post!</p>}
      </Col>
    </Row>
  );
}