import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Post } from '../types/Post';
import { UserLogin } from '../types/UserLogin';
import PostContentEl from './PostContentEl';
import CreateEditPostModal from './CreateEditPostModal';
import DeletePostModal from './DeleteModal';
import PostDetailModal from './PostDetailModal';
import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { getDateString } from '../helpers/DateHelper';
import { Like } from '../types/Like';
import { Author } from '../types/Author';
import {
  HiHeart,
  HiShare,
  HiOutlineHeart,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";


interface Props {
  post: Post;
  loggedInUser?: UserLogin;
  removeFromFeed: Function;
  modifyInFeed: Function,
  isReshareable: Boolean;
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
  const [showError, setShowError] = useState(false);


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
          object: `${props.post.author.host}api/author/${props.post.author.id}/posts/${props.post.id}/`
        }

        return AxiosWrapper.post(`${props.post.author.host}api/author/${props.post.author.id}/inbox/`,
          like, props.loggedInUser
        )
      }).then((res: any) => {
        alert('You liked the post!');
        setHasLiked(true);
      })
  }

  //function to reshare 
  function reshare(post: Post): void{
      //remove author id 
      let data = {
        title: post.title,
        description: post.description,
        visibility: post.visibility,
        unlisted: post.unlisted,
        contentType: post.contentType,
        content: post.content,
        categories: post.categories
      }
      AxiosWrapper.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId + "/posts/", data, props.loggedInUser)
        .then((res: any) => {
          post = res.data;

          const urlPrefix = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser?.authorId}`;
          const authorsUrl = `${urlPrefix}/followers/`;

          return AxiosWrapper.get(authorsUrl, props.loggedInUser);
        }).then((res: any) => {
          let authors: Author[] = res.data.items;
          authors.forEach(a => {
            AxiosWrapper.post(`${a.host}api/author/${a.id}/inbox/`, post, props.loggedInUser);
          });
        }).catch((error: any) => {
          setShowError(true)
        })
      
  }


  const EditCardLink = () => props.loggedInUser !== undefined && isAuthorPost ? <CardLink onClick={() => { setIsEditModalOpen(true); }}><HiOutlinePencil size="1.5em"/></CardLink> : null;
  const DeleteCardLink = () => props.loggedInUser !== undefined && isAuthorPost ? <CardLink onClick={() => { setIsDeleteModalOpen(true); }}><HiOutlineTrash size="1.5em"/></CardLink> : null;
  const LikeCardLink = () => props.loggedInUser
    ? hasLiked
      ? <CardLink><HiHeart size="1.5em"/></CardLink>
      : <CardLink onClick={() => likePost()}><HiOutlineHeart size="1.5em"/></CardLink>
    : null;
  const ReshareCardLink = () => props.loggedInUser !== undefined && !isAuthorPost && props.isReshareable ?<CardLink onClick={() => reshare(props.post)}><HiShare size="1.5em"/></CardLink> : null;
   

  const post: Post = props.post;
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle onClick={() => setIsModalOpen(true)} tag="h5" style={{ cursor: 'pointer' }}>{post.title}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">By: {post.author.displayName}</CardSubtitle>
          <CardSubtitle className="mb-2 text-muted">{getDateString(post)}</CardSubtitle>
          <CardText onClick={() => setIsModalOpen(true)}>🔥{likes.length}</CardText>
          <CardText onClick={() => setIsModalOpen(true)}>{post.description}</CardText>
          <PostContentEl postContent={post} isPreview={true} />
          {LikeCardLink()}
          {ReshareCardLink()}
          {EditCardLink()}
          {DeleteCardLink()}
        </CardBody>
      </Card>
      <PostDetailModal post={post} toggle={toggle} isOpen={isModalOpen} loggedInUser={props.loggedInUser} />
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
