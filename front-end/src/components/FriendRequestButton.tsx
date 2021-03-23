import axios from 'axios';
import { Button } from 'reactstrap'
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';
    
interface Props {
    loggedInUser?: UserLogin;
    currentAuthor?: Author;
    isFollower: boolean;
    setIsFollower: Function;
}

export default function FollowRequestButton(props: Props) {
  // TODO: change this to use currentAuthor.url
  const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + props.currentAuthor?.id + "/followers/" + props.loggedInUser?.authorId + "/";
  const inboxUrl = process.env.REACT_APP_API_URL + "/api/author/" + props.currentAuthor?.id + "/inbox/";
  const loggedInUserUrl = process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser?.authorId;

  const sendFollowRequest = () => {
    // TODO: add authentication
    // get the loggedinuser author object
    axios.get(loggedInUserUrl).then(res => {
      if (!props.isFollower) {
        axios.put(authorUrl, res.data).then(res => {
          if (res.status === 201) {
            props.setIsFollower(true);
          }
        });
      } else {
        axios.delete(authorUrl).then(res => {
          if (res.status === 204) {
            props.setIsFollower(false);
          }
        });
      }
    });
    
  }

  return (
    <>
      <Button onClick={sendFollowRequest}>{props.isFollower ? "Unfollow" : "Follow"}</Button>
    </>
  )


}
    
    