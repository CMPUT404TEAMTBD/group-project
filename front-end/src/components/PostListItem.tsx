import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle, Col, Row } from 'reactstrap';
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
import * as Icons from '../assets/Icons';


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
    AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/auth-user/${props.loggedInUser.username}/`, props.loggedInUser)
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
          alert("You reshared the post!");

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

  const LikeCardLink = () => props.loggedInUser
    ? hasLiked
      ? <CardLink>{Icons.getNum(likes.length)}{Icons.likedButtonIcon}</CardLink>
      : <CardLink onClick={() => likePost()}>{Icons.getNum(likes.length)}{Icons.likeButtonIcon}</CardLink>
    : null;

  const showCardLinks = () => {
    if (isAuthorPost) {
      return (<>
      <Col md={{ size: 'auto'}}>
        <CardLink onClick={() => { setIsEditModalOpen(true) }}>
          {Icons.editButtonIcon}
        </CardLink>
        </Col>
      <Col md={{ size: 'auto'}}>
        <CardLink onClick={() => { setIsDeleteModalOpen(true) }}>
          {Icons.deleteButtonIcon}
        </CardLink>
      </Col>
      </>);
    } else if (!isAuthorPost && props.isReshareable) {
        return (<Col md={{ size: 'auto'}}>
          <CardLink onClick={() => reshare(props.post)}>
            {Icons.shareButtonIcon}
          </CardLink>
        </Col>);
      };
  }

  const post: Post = props.post;
  return (
    <div>
      <Card>
        <CardBody style={{paddingBottom:'0'}}>
          <CardTitle onClick={() => setIsModalOpen(true)} tag="h5" style={{ cursor: 'pointer' }}>{post.title}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">@{post.author.displayName} • {getDateString(post)}</CardSubtitle>
          <CardSubtitle style={{fontStyle: 'italic'}} className="mb-2 text-muted" onClick={() => setIsModalOpen(true)}>{post.description}</CardSubtitle>
          <PostContentEl postContent={post} isPreview={true} />
          </CardBody>
          <CardBody style={{paddingTop:'0'}}>
          <Row className="float-right">
            {props.loggedInUser ? 
              <>
                <Col md={{ size: 'auto'}}>
                  {LikeCardLink()}
                </Col>
                {showCardLinks()}
              </> : null}
          </Row>
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
