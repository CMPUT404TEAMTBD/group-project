import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { GithubEvent } from "../types/Github";

interface Props {
  githubEvent: GithubEvent;
}

/**
 * github list event component to show the author's github events
 * @param props
 */
export default function GithubFeedItem(props: Props) {
  const prUrl = `https://github.com/${props.githubEvent.repo.name}/pull/${props.githubEvent.payload.number}`;

  return (
    <Card className="text-center">
      <CardBody className="mb-2 text-muted">
      <CardTitle>
        <a href={prUrl}>{props.githubEvent.payload.pull_request.title}</a>
      </CardTitle>
        {props.githubEvent.repo.name}
      </CardBody>
    </Card>
  )
}
