import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardLink, CardText, CardHeader } from 'reactstrap';
import { Author } from "../types/Author";
import { UserLogin } from '../types/UserLogin';
import { PostComment } from '../types/PostComment';
import { Like } from '../types/Like'
import {
    HiHeart,
    HiOutlineHeart,
  } from "react-icons/hi";

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
          const resLikes: Like[] = res.data.items;
          console.log(resLikes);
          setLikes(resLikes);
          setHasLiked(resLikes.filter((l: Like) => l.author.id === props.loggedInUser?.authorId).length !== 0);
        })
      }, [hasLiked]);

    const LikeCardLink = () => props.loggedInUser
    ? hasLiked
      ? <CardLink><HiHeart size="1.5em"/></CardLink>
      : <CardLink onClick={() => likeComment()}><HiOutlineHeart size="1.5em"/></CardLink>
    : null;

    function likeComment(): void {
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
          object: `${props.postAuthor.host}api/author/${props.postAuthor.id}/posts/${props.postId}/comment/${props.comment.id}`
        }

        return AxiosWrapper.post(`${props.comment.author.host}api/author/${props.comment.author.id}/inbox/`,
          like, props.loggedInUser
        )
      }).then((res: any) => {
        alert('You liked the comment!');
        setHasLiked(true);
      })
    }

    return (
        <Card>
            <CardHeader className="mb-2 text-muted"><b>@{props.comment.author.displayName}</b></CardHeader>
            <CardBody>
                {props.comment.comment}
                <CardText>🔥{likes.length}</CardText>
                {LikeCardLink()}
            </CardBody>
        </Card>
    )
}
