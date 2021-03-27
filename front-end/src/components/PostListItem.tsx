import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';
import PostContentEl from './PostContentEl';
import CreateEditPostModal from './CreateEditPostModal';
import DeletePostModal from './DeleteModal';
import PostDetailModal from './PostDetailModal';
import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { Like } from '../types/Like';
import { Author } from '../types/Author';

interface Props {
  post: Post;
  loggedInUser?: UserLogin;
  removeFromFeed: Function;
  modifyInFeed: Function
}

/**
 * Post list item component to show a preview for an individual post on a stream
 * @param props 
 */
export default function PostListItem(props: Props) {

  const isAuthorPost: boolean = (props.loggedInUser ? props.loggedInUser.authorId : "") === props.post.author.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const toggle = () => setIsModalOpen(!isModalOpen);
  const toggleEdit = () => setIsEditModalOpen(!isEditModalOpen);
  const toggleDelete = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  useEffect(() => {
    AxiosWrapper.get(`${post.author.host}api/author/${post.author.id}/posts/${post.id}/likes/`, props.loggedInUser).then((res: any) => {
      const resLikes: Like[] = res.data.items;
      setLikes(resLikes);
      setHasLiked(resLikes.filter((l: Like) => l.author.id === props.loggedInUser?.authorId).length !== 0);
    })
  }, [hasLiked]);

  function likePost(): void {
    if (!props.loggedInUser) {
      console.error("User is not logged in, cannot like!");
      return;
    }
    AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/auth-user/${props.loggedInUser.username}`, props.loggedInUser)
      .then((res: any) => {
        const author: Author = res.data;
        const like: Like = {
          type: 'like',
          author: author,
          object: `${process.env.REACT_APP_API_URL}/api/author/${props.post.author.id}/posts/${props.post.id}`
        }

        return AxiosWrapper.post(`${props.post.author.host}api/author/${props.post.author.id}/inbox/`,
          like, props.loggedInUser
        )
      }).then((res: any) => {
        alert('You liked the post!');
        setHasLiked(true);
      })
  }


  const EditCardLink = () => props.loggedInUser !== undefined && isAuthorPost ? <CardLink onClick={() => { setIsEditModalOpen(true); }}>Edit</CardLink> : null;
  const DeleteCardLink = () => props.loggedInUser !== undefined && isAuthorPost ? <CardLink onClick={() => { setIsDeleteModalOpen(true); }}>Delete</CardLink> : null;
  const LikeCardLink = () => props.loggedInUser
    ? hasLiked
      ? <CardLink >Liked</CardLink>
      : <CardLink onClick={() => likePost()}>Like</CardLink>
    : null;

  const post: Post = props.post;
  return (
    <div>
      <Card>
        {/* TODO: Post image here? */}
        {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
        <CardBody>
          <CardTitle onClick={() => setIsModalOpen(true)} tag="h5" style={{ cursor: 'pointer' }}>{post.title}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">By: {post.author.displayName}</CardSubtitle>
          <CardText onClick={() => setIsModalOpen(true)}>🔥{likes.length}</CardText>
          <CardText onClick={() => setIsModalOpen(true)}>{post.description}</CardText>
          <PostContentEl postContent={post} isPreview={true} />
          {EditCardLink()}
          {DeleteCardLink()}
          {LikeCardLink()}
        </CardBody>
      </Card>
      <PostDetailModal post={post} toggle={toggle} isOpen={isModalOpen} />
      {props.loggedInUser !== undefined && isAuthorPost ? <CreateEditPostModal
        loggedInUser={props.loggedInUser}
        toggle={toggleEdit}
        isModalOpen={isEditModalOpen}
        editFields={props.post}
        modifyInFeed={props.modifyInFeed}
      /> : null}
      {props.loggedInUser !== undefined && isAuthorPost ? <DeletePostModal
        loggedInUser={props.loggedInUser}
        isModalOpen={isDeleteModalOpen}
        toggle={toggleDelete}
        postID={props.post.id}
        removeFromFeed={props.removeFromFeed} /> : null}
    </div>
  );
}
