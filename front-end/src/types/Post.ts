import { Author } from "./Author";

export enum PostVisibility {
  PUBLIC = 'Public',
  FRIENDS = 'Friends'
}

export enum PostContentType {
  MARKDOWN = 'text/markdown',
  PLAIN_TEXT = 'text/plain',
  APPLICATION = 'application/base64',
  PNG = 'image/png;base64',
  JPEG = 'image/jpeg;base64'
}

export const imageContentTypes: PostContentType[] = 
[
  PostContentType.APPLICATION,
  PostContentType.PNG, 
  PostContentType.JPEG
]


/**
 * Used for post content elements
 */
export interface PostContent {
  content: string
  contentType: PostContentType
}
export interface Post extends PostContent {
  id: string
  type: string
  title: string
  description: string
  source: string
  origin: string
  visibility: PostVisibility
  unlisted: boolean
  author: Author
  categories: string[] // May need to change this later at some point. I'm not super worried about nested objects currently
  published: string
  count: number
  pageSize: number
  commentLink: string
  comments: any
}