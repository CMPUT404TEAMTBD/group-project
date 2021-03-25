import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import { Author } from '../types/Author';

/**
 * Render list of search results when searching for an author by display name
 * @param props 
 */
export default function AuthorResultsPage(props:any) {

  interface ParamTypes {
    displayName: string
  }

  const { displayName } = useParams<ParamTypes>();

  const [authors, setAuthors] = useState<Author[]>([]);

  // get all authors and filter through to find the one we're searching for
  useEffect(() => {
    // TODO - will need to make requests to all 3 servers. Use Promises.all?
    AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/authors/`)
    .then(response => {
        const filteredAuthorsResponse = response.data.filter((author:Author) => author.displayName === displayName);
        setAuthors(filteredAuthorsResponse);
    })
  }, []);

  return (
    <Row>
      <Col>
        <AuthorList authorList={authors} loggedInUser={props.loggedInUser}/>
      </Col>
    </Row>
  );
}