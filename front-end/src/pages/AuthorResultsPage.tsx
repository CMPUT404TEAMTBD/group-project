import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import { Author } from '../types/Author';

/**
 * Render list of search results when searching for an author by display name
 * @param props 
 */
export default function AuthorResultsPage(props:RouteComponentProps) {

  interface ParamTypes {
    displayName: string
  }

  const { displayName } = useParams<ParamTypes>();

  const [authors, setAuthors] = useState<Author[]>([]);

  // get all authors and filter through to find the one we're searching for
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/authors/`)
    .then(response => {
        const filteredAuthorsResponse = response.data.results.filter((author:Author) => author.displayName === displayName);
        setAuthors(filteredAuthorsResponse);
    })
  }, []);

  return (
    <Row>
      <Col>
        <AuthorList authorList={authors}/>
      </Col>
    </Row>
  );
}