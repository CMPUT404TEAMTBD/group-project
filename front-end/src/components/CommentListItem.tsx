import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, CardImg, CardTitle, Button, CardLink, CardSubtitle, ListGroupItem, ListGroupItemHeading, ListGroupItemText, ListGroup, CardHeader } from 'reactstrap';
import { Author } from "../types/Author";
import { UserLogin } from '../types/UserLogin';
import FollowRequestButton from './FriendRequestButton';
import { PostComment } from '../types/PostComment';

interface Props {
    comment: PostComment,
}

export default function CommentListItem(props: Props) {
    // TODO: add button/logic/functionality for liking comments
    return (
        <Card>
            <CardHeader className="mb-2 text-muted"><b>@{props.comment.author.displayName}</b></CardHeader>
            <CardBody>
                {props.comment.comment}
            </CardBody>
        </Card>
    )
}
