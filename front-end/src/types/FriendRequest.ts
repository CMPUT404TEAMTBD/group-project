import { Author } from "./Author";

export interface FriendRequest {
    type: string
    summary: string
    actor: {
        type: string
        id: string
        host: string
        displayName: string
        github: string
    }
    object: { // AUTHOR
        type: string
        id: string
        host: string
        displayName: string
        url: string
        github: string
    }
}