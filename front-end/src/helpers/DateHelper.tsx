import { Post } from "../types/Post";
import dateformat from "dateformat";

export function getDateString(post: Post) {
  let date: Date = new Date(post.published);
  return dateformat(date, "dddd, mmmm dS, yyyy, h:MM TT")
}