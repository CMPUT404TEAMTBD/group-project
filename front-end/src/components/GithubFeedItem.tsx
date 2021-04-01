import { Card, CardBody } from "reactstrap";
import { GithubEvent } from "../types/Github";

interface Props {
  githubEvent: GithubEvent;
}

/**
 * github list event component to show the author's github events
 * @param props
 */
export default function LikeListItem(props: Props) {
  return (
    <Card>
      <CardBody>
        <p>Performed a {props.githubEvent.type} on the repo {props.githubEvent.repo.name}</p>
      </CardBody>
    </Card>
  )
}
