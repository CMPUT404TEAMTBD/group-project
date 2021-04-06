import { ListGroup, ListGroupItem } from "reactstrap";
import { Like } from "../types/Like";
import LikeListItem from "./LikeListItem";

interface Props {
  likesList: Like[];
}

/**
 * Shows all the likes recieved
 * @param props
 */
export default function LikesFeed(props: Props) {
  return (
    <ListGroup>
      {props.likesList?.length !== 0 ?
       props.likesList?.map((like: Like, i) => <LikeListItem like={like} key={i}/>):
       <ListGroupItem>No likes found! Everyone hates you :(</ListGroupItem>
      }
      </ListGroup>
  )
}
