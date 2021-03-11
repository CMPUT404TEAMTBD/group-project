import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap'
import { Author } from '../types/Author';
import { UserLogin } from '../types/UserLogin';
    
interface Props {
    loggedInUser: UserLogin;
    currentAuthor: Author;
}

export default function FriendRequestButton(props: Props) {
  const followersUrl = process.env.REACT_APP_API_URL + "/api/authors/" + props.currentAuthor.id + "/followers";
  const [followers, setFollowers] = useState<Author[] | undefined>(undefined);

  useEffect(() => {
    // get followers for author
    axios.get(followersUrl).then(res => {
      setFollowers(res.data["items"]);
    }).catch(err => {
      console.log("ERROR GETTING FOLLOWERS");
    })
  });
  
  const showFriendRequestButton = () => {
    // show friend request button only if it is not the loggedin user or the loggedin user is not already a follower
    let followerIds = followers?.map(follower => follower.id)
    return (props.currentAuthor.id !== props.loggedInUser.authorId) || (!followerIds?.includes((props.currentAuthor.id)));
  }

  const sendFriendRequest = () => {
    let data = {
      
    }
      
    // TODO: add authentication
    axios.put(followersUrl + "/" + props.loggedInUser.authorId, data).then(res => {
      if (res.status == 200)
    });
  }

  return (
    <>
      {}
      {showFriendRequestButton() ? <Button onClick={sendFriendRequest}>Follow</Button> : null}
    </>
  )


}
    
    