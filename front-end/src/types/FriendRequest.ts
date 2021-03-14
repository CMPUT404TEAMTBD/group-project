import { Author } from "./Author";

export interface FriendRequest {
    type: string
    summary: string
    actor: Author // requester
    object: Author // requestee
}