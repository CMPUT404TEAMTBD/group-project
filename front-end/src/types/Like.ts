import { Author } from "./Author";

export interface Like {
  type: string,
  author: Author,
  // Object is the id of the post
  object: string
}