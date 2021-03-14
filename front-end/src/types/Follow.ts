import { Author } from "./Author";

export interface Follow {
    type: string
    summary: string
    actor: Author // requester
    object: Author // requestee
}