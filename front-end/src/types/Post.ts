export interface Post {
  _id: string
  _type: string
  title: string
  description: string
  source: string
  origin: string
  visibility: string
  unlisted: boolean
  isPrivateToFriends: boolean
  author: string
  contentType: string
  categories: any // May need to change this later at some point. I'm not super worried about nested objects currently
  published: string
  count: number
  pageSize: number
  commentLink: string
  comments: any
}