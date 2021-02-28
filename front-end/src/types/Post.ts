import { Author } from "./Author";

export interface Post {
  id: string
  type: string
  title: string
  description: string
  source: string
  origin: string
  visibility: string
  unlisted: boolean
  author: Author
  content: string
  contentType: string
  categories: string[] // May need to change this later at some point. I'm not super worried about nested objects currently
  published: string
  count: number
  pageSize: number
  commentLink: string
  comments: any
}