import AuthorListItem from "./AuthorListItem"
import { Author } from "../types/Author";
import { UserLogin } from "../types/UserLogin";
import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

interface Props {
  authorList: Author[] | undefined;
  loggedInUser: UserLogin;
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function AuthorList(props: Props) {

  return (
    <>
      {props.authorList?.length !== 0 ?
       props.authorList?.map((author: Author) => <AuthorListItem author={author} loggedInUser={props.loggedInUser} key={author.id}></AuthorListItem>):
       <Card body className="text-center"><CardBody><CardTitle tag="h5" >No Authors Found :(</CardTitle></CardBody></Card>
      }
    </>
  )
}
