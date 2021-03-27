import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import AuthorList from "../components/AuthorList"
import { Author } from '../types/Author';
import { Node } from '../types/Node';
import axios from 'axios';

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

  const authorsUrl = `${process.env.REACT_APP_API_URL}/api/authors/`
  const nodesUrl = `${process.env.REACT_APP_API_URL}/api/nodes/`;

  // get all authors and filter through to find the one we're searching for
  useEffect(() => {
    axios.get<Node[]>(nodesUrl).then(res => {
      let nodes: Node[] = res.data;
      let externalAuthors = nodes.map((n: Node) => {
        const url = `${n.host}api/authors/`
        console.log(`Getting authors from ${url}`);
        return AxiosWrapper.get(url, props.loggedInUser);
      })

      Promise.allSettled([AxiosWrapper.get(authorsUrl, props.loggedInUser), ...externalAuthors]).then((results: any) => {
        let authors = results.filter((r: any) => r.status === "fulfilled").map((r: any) => r.value.data).flat(); 
        setAuthors(authors.filter((a: Author) => a.displayName === displayName));
      })
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
