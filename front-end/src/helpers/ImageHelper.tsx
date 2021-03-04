import { imageContentTypes, PostContent } from '../types/Post';

export function isImage(post: PostContent): boolean {
  return imageContentTypes.includes(post.contentType) 
}