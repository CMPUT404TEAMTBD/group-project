import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Follow } from '../types/Follow';
import AuthorListItem from './AuthorListItem';

// TODO: update/remove the friend request item from the list when you follow back/accept
const FriendRequestListModal = (props: any) => {
  const [friendReqEntries, setFriendReqEntries] = useState<Follow[] | undefined>(undefined);

  useEffect(() => {
    AxiosWrapper.get(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/inbox/", props.loggedInUser).then((res: any) => {
      const friendReqs: Follow[] = res.data.items.filter((fr: Follow) => { return fr.type === 'follow' });
      setFriendReqEntries(friendReqs);
    })
  }, []);

  function friendRequestsToDisplay() {
    return (
      <ModalBody>
        {friendReqEntries?.length !== 0 ?
          friendReqEntries?.map((follow: Follow) => <AuthorListItem author={follow.actor} loggedInUser={props.loggedInUser}></AuthorListItem>) :
          <Card body className="text-center"><CardBody><CardTitle tag="h5" >No Friend Requests :(</CardTitle></CardBody></Card>
        }
      </ModalBody>);
  }

  return (
    <>
      <Modal isOpen={props.isFriendRequestOpen} size="lg" toggle={() => props.setIsFriendRequestOpen(!props.isFriendRequestOpen)}>
        <ModalHeader toggle={() => props.setIsFriendRequestOpen(!props.isFriendRequestOpen)}>
          Friend Requests
                </ModalHeader>
        {friendRequestsToDisplay()}
      </Modal>
    </>
  );
}

export default FriendRequestListModal;