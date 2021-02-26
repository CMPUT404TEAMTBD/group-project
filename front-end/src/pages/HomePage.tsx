import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Form, Input } from 'reactstrap';
import axios from 'axios';
interface userProps {
  url: string;
  displayName: string;
  _id: string;
  github: string;

}

// https://stackoverflow.com/questions/44118060/react-router-dom-with-typescript/44571743
export default function HomePage(props:RouteComponentProps) {

  const [userSearch,setUserSearch] = useState<userProps>();

  const [postEntries, setPostEntries] = useState();

  function onUserSearchChange(e:any){
    setUserSearch(e.target.value);
  }

  function searchUsers(e:any){
    e.preventDefault();
    //props.history.push('/authors/'+userSearch);
    axios.get('process.env.REACT_APP_API_URL + "/api/author/' + userSearch + "/")
      .then(response => {
      console.log(response.data);
      setUserSearch(response.data);  
  });
    
  }

  
  function result(){
    if (userSearch){
      return (
        <>
        <p>
          {userSearch['_id']}
        </p>
        <p>
          {userSearch['displayName']}
        </p>
        <p>
          {userSearch['url']}
        </p>
        <p>
          {userSearch['github']}
        </p>
        
        </>
      )
      
    }

    else{
      <p>
        No result
      </p>
    }

  }

  return (
    <Row>
      <Col>
        <Form inline={true} onSubmit={e => searchUsers(e)}>
          <Input type="text" name="Author Search" placeholder="Search Authors" onChange={e => onUserSearchChange(e)}/>
        </Form>
      </Col>
      <Col>
        <h3>Feed</h3>
        {result()}

       
      </Col>
    </Row>
  );
}