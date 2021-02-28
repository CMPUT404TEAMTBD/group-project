import { imageContentTypes, Post } from '../types/Post';

export function isImage(post: Post): boolean {
  return imageContentTypes.includes(post.contentType) 
}