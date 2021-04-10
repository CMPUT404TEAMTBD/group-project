import React, { useEffect, useState } from 'react';
import { CardLink, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { PostComment } from '../types/PostComment';
import { UserLogin } from '../types/UserLogin';
import CommentFormElement from './CommentFormElement';
import CommentList from './CommentList';
import PostContent from './PostContentEl';
import { getDateString } from '../helpers/DateHelper';
import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { chevronDoubleDown, linkIcon } from '../assets/Icons';

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
  const [commentPageNum, setCommentPageNum] = useState(1);
  const [noMoreComments, setNoMoreComments] = useState(false);

  function fetchComments() {
    if (props.loggedInUser !== undefined) {
      AxiosWrapper.get(`${post.author.url}posts/${post.id}/comments/?page=${commentPageNum}`, props.loggedInUser).then((res: any) => {
        const comments: PostComment[] = res.data;
        if (res.status === 204 || comments.length < 5) {
          setNoMoreComments(true);
        }
        if (commentList) {
          setCommentList([...commentList, ...comments])
        } else {
          setCommentList(comments)
        }
        setCommentPageNum(commentPageNum + 1)
      }).catch((err: any) => {
        console.error(err);
      }); 
    }
  }

  function copyLinkToClipboard(post: Post) {
    navigator.clipboard.writeText(`${window.location.host}/posts/${post.id}`);
    alert("Link Copied!");
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
        <div className="mb-4" style={{height: "1em"}} >
          {/* I'm being hypocritical here using CardLink in a Modal */}
          <CardLink onClick={()=>copyLinkToClipboard(post)}>{linkIcon}</CardLink>
        </div>
        <div>
          <p>{post.description}</p>
          <PostContent postContent={post} isPreview={false}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <CommentFormElement loggedInUser={props.loggedInUser} postId={post.id} postAuthor={post.author} commentList={commentList} setCommentList={setCommentList} />
      </ModalFooter>
      {props.loggedInUser && <ModalFooter><CommentList loggedInUser={props.loggedInUser} postId={post.id} postAuthor={post.author} commentList={commentList} /></ModalFooter>}
      {!noMoreComments ? <CardLink onClick={() => fetchComments()} style={{paddingBottom: '1em', marginLeft: 'auto', marginRight: 'auto'}}>{chevronDoubleDown}</CardLink> : null}
    </Modal>
  );
}

