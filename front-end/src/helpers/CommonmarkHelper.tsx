import { PostContentType, PostContent } from '../types/Post';

export function isCommonmark(post: PostContent): boolean {
  return post.contentType === PostContentType.MARKDOWN
}