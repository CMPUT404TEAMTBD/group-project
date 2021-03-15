import axios from 'axios';
import { Button } from 'reactstrap'
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';
    
interface Props {
    loggedInUser: UserLogin;
    currentAuthor?: Author;
    isFollower: boolean;
    setIsFollower: Function;
}

export default function FollowRequestButton(props: Props) {
  const url = process.env.REACT_APP_API_URL + "/api/author/" + props.currentAuthor?.id + "/followers/" + props.loggedInUser.authorId + "/";

  const sendFollowRequest = () => {
    // TODO: add authentication
    let data = {
      "receiver" : props.currentAuthor?.id,
      "sender" : props.loggedInUser.authorId,
      "approved" : false
    }
    if (!props.isFollower) {
      axios.put(url, data).then(res => {
        if (res.status === 201) {
          props.setIsFollower(true);

        }
      });
    } else {
      axios.delete(url).then(res => {
        if (res.status === 204) {
          props.setIsFollower(false);
        }
      });
    }
  }

  return (
    <>
      <Button onClick={sendFollowRequest}>{props.isFollower ? "Unfollow" : "Follow"}</Button>
    </>
  )


}
    
    