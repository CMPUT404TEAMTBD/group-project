import { Author } from "./Author";
import { PostContentType } from "./Post";

export interface PostComment {
    // type: string,
    id: string,
    author: Author,
    comment: string,
}