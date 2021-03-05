import { imageContentTypes, PostContent } from '../types/Post';

// check if post includes an image
export function isImage(post: PostContent): boolean {
  return imageContentTypes.includes(post.contentType) 
}