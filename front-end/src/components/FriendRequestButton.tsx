import { AxiosWrapper } from '../helpers/AxiosWrapper';
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
  const authorUrl = `${process.env.REACT_APP_API_URL}/api/author/${props.currentAuthor?.id}/followers/${props.loggedInUser?.authorId}/`;
  const loggedInUserUrl = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser?.authorId}/`;
  const followingUrl = `${loggedInUserUrl}following/${props.currentAuthor?.id}/`;

  const sendFollowRequest = () => {
    // TODO: add authentication
    // get the loggedinuser author object
    AxiosWrapper.get(loggedInUserUrl).then((res: any) => {
      if (!props.isFollower) {
        AxiosWrapper.put(authorUrl, res.data).then((res: any) => {
          if (res.status === 201) {
            props.setIsFollower(true);
          }
        });
        axios.put(followingUrl, props.currentAuthor).then(res => {
          if (res.status === 201) {
            console.log(props.loggedInUser?.username + " is now following " + props.currentAuthor?.displayName);
          }
        });
      } else {
        AxiosWrapper.delete(authorUrl).then((res: any) => {
          if (res.status === 204) {
            props.setIsFollower(false);
          }
        });
        axios.delete(followingUrl).then(res => {
          if (res.status === 204) {
            console.log("UNFOLLOWED");
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
    
    