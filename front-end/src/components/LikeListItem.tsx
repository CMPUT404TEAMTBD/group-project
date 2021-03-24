import { Card, CardBody } from "reactstrap";
import { Like } from "../types/Like";

interface Props {
  like: Like;
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function LikelListItem(props: Props) {
  return (
    <Card>
      <CardBody>
        <p>{props.like.author.displayName} liked your post!</p>
      </CardBody>
    </Card>
  )
}
