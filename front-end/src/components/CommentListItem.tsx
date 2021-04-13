import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardLink, CardText, CardHeader } from 'reactstrap';
import { Author } from "../types/Author";
import { UserLogin } from '../types/UserLogin';
import { PostComment } from '../types/PostComment';
import { Like } from '../types/Like'
import { likeButtonIcon, likedButtonIcon } from '../assets/Icons';
import { getDateString } from '../helpers/DateHelper';
import PostContentEl from './PostContentEl';

interface Props {
  postId: string,
  postAuthor: Author,
  comment: PostComment,
  loggedInUser: UserLogin | undefined,
}

export default function CommentListItem(props: Props) {    
  const [likes, setLikes] = useState<Like[]>([]);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    AxiosWrapper.get(`${props.comment.author.host}api/author/${props.postAuthor.id}/posts/${props.postId}/comments/${props.comment.id}/likes/`, props.loggedInUser).then((res: any) => {
      const resLikes: Like[] = res.data.items === undefined ? [] : res.data.items;
      setLikes(resLikes);
      setHasLiked(resLikes.filter((l: Like) => l.author.id === props.loggedInUser?.authorId).length !== 0);
    })
  }, [hasLiked, props.comment.author.host, props.comment.id, props.loggedInUser, props.postAuthor.id, props.postId]);

  const LikeCardLink = () => props.loggedInUser
  ? hasLiked
    ? <CardLink>{likedButtonIcon}</CardLink>
    : <CardLink onClick={() => likeComment()}>{likeButtonIcon}</CardLink>
  : null;

  function likeComment(): void {
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
          object: `${props.postAuthor.host}api/author/${props.postAuthor.id}/posts/${props.postId}/comment/${props.comment.id}`
        }

        return AxiosWrapper.post(`${props.comment.author.host}api/author/${props.comment.author.id}/inbox/`,
          like, props.loggedInUser
        )
      }).then((res: any) => {
        alert('You liked the comment!');
        setHasLiked(true);
      });
  }

  return (
      <Card>
          <CardHeader className="mb-2 text-muted"><b>@{props.comment.author.displayName}</b> {getDateString(props.comment)}</CardHeader>
          <CardBody>
            <PostContentEl postContent={{content:props.comment.comment,contentType:props.comment.contentType}} isPreview={false}/>
            <CardText>❤️{likes.length}</CardText>
            {LikeCardLink()}
          </CardBody>
      </Card>
  )
}
