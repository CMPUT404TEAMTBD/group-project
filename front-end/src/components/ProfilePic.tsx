import React from "react"
import { Author } from "../types/Author"

interface Props{
  author: Author
  style?: React.CSSProperties
}

export default function profilePic(props:Props){
  if (props.author.github?.includes("github.com")) {
    return <img width="100%" src={props.author.github + ".png"} alt="Card image cap" style={props.style}/>
  } else {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={props.style}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
  }
}