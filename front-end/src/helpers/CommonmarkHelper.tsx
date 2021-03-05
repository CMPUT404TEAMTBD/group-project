import { PostContentType, PostContent } from '../types/Post';

// check if post is of type markdown/commonmark
export function isCommonmark(post: PostContent): boolean {
  return post.contentType === PostContentType.MARKDOWN
}