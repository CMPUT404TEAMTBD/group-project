import { Author } from "../types/Author";
import { Node } from '../types/Node';
import { UserLogin } from "../types/UserLogin";
import React, { useEffect, useState } from "react";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from "axios";
import { AxiosWrapper } from "../helpers/AxiosWrapper";
import ProfilePic from "./ProfilePic";
import { useHistory } from "react-router-dom";

interface Props {
  loggedInUser: UserLogin
}


/**
 * Author search bar to search up authors
 * Based on code from ericgio, http://ericgio.github.io/react-bootstrap-typeahead/#asynchronous-searching
 * @param props
 */
export default function AuthorSearchBar(props: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Author[]>([]);
  
  const authorsUrl = `${process.env.REACT_APP_API_URL}/api/authors/`
  const nodesUrl = `${process.env.REACT_APP_API_URL}/api/nodes/`;

  const history = useHistory();

  // get all authors on load
  useEffect(() => {
    handleSearch();
  }, []);
  

  const handleSearch = () => {
    setIsLoading(true);
  
    axios.get<Node[]>(nodesUrl).then(res => {
      let nodes: Node[] = res.data;
      let externalAuthors = nodes.map((n: Node) => {
        const url = `${n.host}api/authors/`
        console.log(`Getting authors from ${url}`);
        return AxiosWrapper.get(url, props.loggedInUser);
      })

      Promise.allSettled([AxiosWrapper.get(authorsUrl, props.loggedInUser), ...externalAuthors]).then((results: any) => {
        let authors = results.filter((r: any) => r.status === "fulfilled").map((r: any) => r.value.data).flat(); 
        setOptions(authors);
      })
    })
    setIsLoading(false);
  };

  const redirectToAuthor = (author:Author) => {
    history.push(`/author/${author.id}`);
  }

  return (
    <>
      <AsyncTypeahead 
          id={"authorSearchBar"}
          filterBy={['displayName', 'host', 'github']}
          labelKey={(a:Author)=>a.displayName}
          isLoading={isLoading}
          minLength={3}
          onSearch={handleSearch}
          options={options}
          placeholder="Search"
          onChange={(authors:Author[])=>redirectToAuthor(authors[0])}
          renderMenuItemChildren={(author:Author, props) => (
            <>
              <ProfilePic author={author} style={{width:'2em', marginRight:'1rem'}}/>
              <span>{author.displayName}<span className={'text-muted'}>, {author.host}</span></span>
            </>
          )}
        />
    </>
  )
}