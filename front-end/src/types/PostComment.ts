import { Author } from "./Author";
import { PostContentType } from "./Post";

export interface PostComment {
    // type: string,
    author: Author,
    comment: string,
}