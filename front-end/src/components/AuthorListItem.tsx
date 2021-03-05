import React from "react"
import { Link } from "react-router-dom";
import { Author } from "../types/Author";

interface Props {
  author: Author
}

/**
 * Author list item component to show an individual author
 * @param props 
 */
export default function AuthorListItem(props: Props) {
  return (
    <>
      <div>
        <h3>{props.author.displayName} {props.author.github}</h3>
      </div>
      <div>
        <Link to={{ pathname: `/author/${props.author.id}` }} >
          View Profile
        </Link>
      </div>
    </>
  )
}
