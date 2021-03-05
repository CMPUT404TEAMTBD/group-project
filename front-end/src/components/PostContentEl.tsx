import React from "react"
import ReactCommonmark from "react-commonmark"
import { isCommonmark } from "../helpers/CommonmarkHelper"
import { isImage } from "../helpers/ImageHelper"
import { Post, PostContent } from "../types/Post"

interface Props {
  postContent: PostContent;
  isPreview: boolean;
}

const MAX_PREVIEW_LENGTH = 50;

/**
 * Post content element for displaying the contents of a post
 * @param props 
 */
export default function PostContentEl(props:Props) {
  if (isImage(props.postContent)) {
    return <img src={props.postContent.content} style={{width:'100%'}}/>
  } else {
    const shouldBeTruncated = props.isPreview && props.postContent.content.length > MAX_PREVIEW_LENGTH;
    const content = shouldBeTruncated ? `${props.postContent.content.slice(0,MAX_PREVIEW_LENGTH-1)}...`
                                    : props.postContent.content
    if (isCommonmark(props.postContent)){
      return <div style={{width:'100%', wordWrap:"break-word"}}>
              <ReactCommonmark source={content}/>
            </div>
    }
    else {
      return <p style={{width:'100%', wordWrap:"break-word"}}>{content}</p>
    }
  }
}