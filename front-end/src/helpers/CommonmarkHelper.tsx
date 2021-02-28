import { Post, PostContentType } from '../types/Post';

export function isCommonmark(post: Post): boolean {
  return post.contentType === PostContentType.MARKDOWN
}