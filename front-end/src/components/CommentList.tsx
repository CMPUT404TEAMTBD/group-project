import { Col, Container } from 'reactstrap';
import { PostComment } from '../types/PostComment';
import CommentListItem from './CommentListItem';

interface Props {
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
        {props.commentList && props.commentList.map((c: PostComment) => <CommentListItem comment={c} />)}
      </Col>
    </Container>
  );
}

