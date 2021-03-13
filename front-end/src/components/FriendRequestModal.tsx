import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, CardSubtitle, Col, Row } from 'reactstrap';

const FriendRequestModal = (props: any) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);
  const t = "";

  const toggle = () => setModal(!modal);

  let friendRequestList;

  return (
    <>
      <Card>
        <CardBody>
          <Row>
          <Col xs="2">
          Picture
          </Col>
          <Col xs="7">
          <CardTitle tag="h5" >Friend Request</CardTitle>
          <CardSubtitle tag="h6">From: host.url</CardSubtitle>
          </Col>
          <Col xs="3">
          <Button color="success">Accept</Button>
          <Button color="danger">Reject</Button>
          </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default FriendRequestModal;