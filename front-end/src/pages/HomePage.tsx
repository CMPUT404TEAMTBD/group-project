import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Form, Input } from 'reactstrap';


// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props:RouteComponentProps) {

  const [userSearch,setUserSearch] = useState('')

  function onUserSearchChange(e:any){
    setUserSearch(e.target.value);
  }

  function searchUsers(e:any){
    e.preventDefault();
    props.history.push('/authors/'+userSearch);
  }

  return (
  <Row>
    <Col>
      <h3 className={"font-title"}>Home page :)</h3>
      <Form inline={true} onSubmit={e => searchUsers(e)}>
        <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)}/>
      </Form>
    </Col>
  </Row>
  );
}