import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { Button } from 'reactstrap'
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';
import { ResponseHelper } from '../helpers/ResponseHelper';
import * as Icons from '../assets/Icons';
    
interface Props {
    loggedInUser?: UserLogin;
    currentAuthor?: Author;
    isFollower: boolean;
    setIsFollower: Function;
}

export default function FollowRequestButton(props: Props) {
  // TODO: fix author URL so we can handle foreign authors
  const authorUrl = `${props.currentAuthor?.host}api/author/${props.currentAuthor?.id}/followers/${props.loggedInUser?.authorId}/`;
  const loggedInUserUrl = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser?.authorId}/`;
  const followingUrl = `${loggedInUserUrl}following/${props.currentAuthor?.id}/`;

  const sendFollowRequest = () => {
    // get the loggedinuser author object
    props.setIsFollower(!props.isFollower);
    AxiosWrapper.get(loggedInUserUrl, props.loggedInUser).then((res: any) => {
      if (!props.isFollower) {
        let followObject = {
          type: "follow",
          actor: res.data,
          object: props.currentAuthor
        }
        AxiosWrapper.put(authorUrl, followObject, props.loggedInUser).catch((res: any) => {
          props.setIsFollower(false);
          alert("There was an error following");
        });
        AxiosWrapper.put(followingUrl, props.currentAuthor, props.loggedInUser).then((res: any) => {
          if (ResponseHelper.isSuccess(res)) {
            console.log(props.loggedInUser?.username + " is now following " + props.currentAuthor?.displayName);
          }
        });
      } else {
        AxiosWrapper.delete(authorUrl, props.loggedInUser).catch((res: any) => {
          props.setIsFollower(true);
          alert("There was an error unfollowing");
        });
        AxiosWrapper.delete(followingUrl, props.loggedInUser).then((res: any) => {
          if (ResponseHelper.isSuccess(res)) {
            console.log("UNFOLLOWED");
          }
        });
      }
    });
    
  }

  return (
    <>
      <Button color="white" onClick={sendFollowRequest}>{props.isFollower ? Icons.unfollowIcon : Icons.followIcon}</Button>
    </>
  )


}
    
    