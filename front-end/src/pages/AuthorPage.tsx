import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Post } from '../types/Post';
import {
  Col,
  Container,
  Row,
  Alert,
  Card,
  CardImg,
  CardTitle,
  ListGroup,
  ListGroupItem,
  CardBody,
} from 'reactstrap';
import { Author } from '../types/Author';
import FollowRequestButton from '../components/FriendRequestButton';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import { isValidGithub } from '../helpers/GithubHelper';
import GithubFeed from '../components/GithubFeed';
import * as Icons from '../assets/Icons';

interface Props extends RouteComponentProps<MatchParams>{
  loggedInUser?: string,
}

interface MatchParams {
  authorId: string
}

/**
 * Author Page will render and display an author's profile - this includes information
 * about their user account and all the posts they have made
 * @param props 
 */
export default function AuthorPage(props: any) {
  // TODO: don't use props.location.pathname
  const authorUrl = process.env.REACT_APP_API_URL + "/api" + props.location.pathname;
  const [author, setAuthor] = useState<Author | undefined>(undefined);
  const [responseMessage, setResponseMessage] = useState(100);
  const [postEntries, setPostEntries] = useState<Post[] | undefined>(undefined);
  const [isFollower, setIsFollower] = useState<boolean>(false);

  // After clicking the profile navlink, get the appropriate author info and data
  useEffect(() => {
    AxiosWrapper.get(authorUrl, props.loggedInUser).then((res: any) => {
      const authorOb: Author = res.data;
      setAuthor(authorOb);
      setResponseMessage(200);
    }).catch((err: any) => {
      console.error("ERROR GETTING AUTHOR INFO");
      setResponseMessage(500);
    })

    if (props.loggedInUser) {
      // get whether user is follower of author IF not looking at our own profile
      if (!props.location.pathname.includes(props.loggedInUser.authorId)) {
        AxiosWrapper.get(`${authorUrl}/followers/${props.loggedInUser.authorId}/`, props.loggedInUser).then((res: any) => {
          setIsFollower(true);
        }).catch((err: any) => {
          // 404 is not a follower
          setIsFollower(false);
        });
      }

      AxiosWrapper.get(authorUrl + "/posts/", props.loggedInUser).then((res: any) => {
        const posts: Post[] = res.data;
        setPostEntries(posts);
      }).catch((err: any) => {
        console.error("ERROR GETTING POSTS");
        setResponseMessage(500);
      })
    };
  }, []);

  // Author's profile pic will be the same one from their GitHub
  const profilePic = (github: string | undefined) => {
    if (github && github.split('https://github.com/').pop()) {
      return <CardImg top width="100%" src={github + ".png"} alt="Card image cap" />
    } else {
      return <CardBody>{Icons.defaultProfilePic}</CardBody>;
    }
  }

  if (responseMessage > 299) {
    return (<Container>
      <Alert color="danger">An error occurred! Please try again</Alert>
    </Container>)
  }


  const displayProfileButtons = () => {
    if (props.loggedInUser && author?.id === props.loggedInUser.authorId) {
      return (<>
        <ListGroupItem tag="a" href={`/author/${props.loggedInUser.authorId}/followers`}>Followers</ListGroupItem>
        <ListGroupItem tag="a" href={`/author/${props.loggedInUser.authorId}/following`}>Following</ListGroupItem>
      </>)
    } else {
      return <FollowRequestButton loggedInUser={props.loggedInUser} currentAuthor={author} isFollower={isFollower} setIsFollower={setIsFollower} />
    }
  }

  return (
    <>
      <Row>
        <Col>
          <CardTitle tag="h2">{author?.displayName}</CardTitle>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col>
          <Card body className="text-center">
            <Row>
              <Col sm={3}>
                {profilePic(author?.github)}
                <ListGroup>
                  {displayProfileButtons()}
                  <ListGroupItem tag="a" href={author ? author.github : "#"}>
                    GitHub {Icons.githubIcon}
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col>
                {author && isValidGithub(author.github) && (
                  <>
                    <GithubFeed github={author.github} />
                  </>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}