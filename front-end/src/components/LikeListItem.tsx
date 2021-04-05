import { ListGroupItem } from "reactstrap";
import { Like } from "../types/Like";

interface Props {
  like: Like;
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function LikeListItem(props: Props) {
  return (
    <ListGroupItem>
      {props.like.author.displayName} liked your post!
    </ListGroupItem>
  );
}
