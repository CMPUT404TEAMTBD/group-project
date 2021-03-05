import React from "react"
import AuthorListItem from "./AuthorListItem"
import { Author } from "../types/Author";

interface Props {
  authorList: Author[]
}

export default function AuthorList(props: Props) {
  return (
    <>
      {props.authorList.map((author: Author) => <AuthorListItem author={author}></AuthorListItem>)}
    </>
  )
}
