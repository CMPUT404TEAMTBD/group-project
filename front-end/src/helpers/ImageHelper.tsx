import { Post } from '../types/Post';

const imageTypes = ["application/base64", "image/png;base64", "image/jpeg;base64"]

export function isImage(post: Post): boolean {
  return imageTypes.includes(post.contentType) 
}