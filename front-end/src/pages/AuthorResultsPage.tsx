import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import { Author } from '../types/Author';
import { Node } from '../types/Node';

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
    // NOTE: Search functionality does not work for users that are not logged in. (they have no Node credentials).
    let requests = AxiosWrapper.nodes.map((n: Node) => {
      return AxiosWrapper.get(`${n.host}/api/authors/`);
    })

    Promise.all(requests).then((authors: any) => {
      setAuthors(authors.data.filter((a: Author) => a.displayName === displayName));
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