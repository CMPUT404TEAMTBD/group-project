import React from "react"
import { UserProfileIcon } from "../assets/Icons"
import { Author } from "../types/Author"

interface Props{
  author?: Author
  style?: React.CSSProperties
}

export default function ProfilePic(props:Props){
  if (props.author?.github?.includes("github.com")) {
    return <img width="100%" src={props.author.github + ".png"} alt="Card image cap" style={props.style}/>
  } else {
    return <UserProfileIcon style={props.style}/>
  }
}