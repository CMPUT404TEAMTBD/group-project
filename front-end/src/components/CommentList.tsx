import { Col, Container } from 'reactstrap';
import { UserLogin } from '../types/UserLogin';
import { Author } from '../types/Author';
import { PostComment } from '../types/PostComment';
import CommentListItem from './CommentListItem';

interface Props {
  loggedInUser: UserLogin | undefined,
  postId: string,
  postAuthor: Author,
  commentList: PostComment[] | undefined,
}

/**
 * Post list component to show list of comments
 * @param props 
 */
export default function CommentList(props: Props) {
  return (
    <Container fluid>
      <Col>
        {props.commentList && props.commentList.map((c: PostComment) => <CommentListItem comment={c} 
                                                                loggedInUser={props.loggedInUser} 
                                                                postId={props.postId} 
                                                                postAuthor={props.postAuthor}/>)}
      </Col>
    </Container>
  );
}

