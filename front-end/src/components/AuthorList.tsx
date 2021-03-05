import React from "react"
import AuthorListItem from "./AuthorListItem"
import { Author } from "../types/Author";

interface Props {
  authorList: Author[]
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function AuthorList(props: Props) {

  return (
    <>
      {props.authorList.length !== 0 ?
       props.authorList.map((author: Author) => <AuthorListItem author={author}></AuthorListItem>):
       <h4>No Authors Found :(</h4>
      }
    </>
  )
}
