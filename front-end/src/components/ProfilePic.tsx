import React from "react"
import { UserProfileIcon } from "../assets/Icons"
import { Author } from "../types/Author"

interface Props{
  author?: Author
  style?: React.CSSProperties
}

export default function ProfilePic(props:Props){
  const githubUsername = props.author?.github?.split("https://github.com/").pop();

  if (!props.author || !props.author.github.includes("github.com/") ||
      !props.author.github.split('https://github.com/').pop()) {
    return <UserProfileIcon style={props.style}/>
  }

  if (githubUsername && githubUsername.length > 0) {
    return <a href={props.author ? props.author.github : "#"}>
      <img width="100%" src={props.author?.github + ".png"} alt="Card image cap" style={props.style}/>
      </a>
  }

  return <UserProfileIcon style={props.style}/>
}