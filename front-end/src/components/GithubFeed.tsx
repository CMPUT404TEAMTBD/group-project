import axios from "axios";
import React, { useEffect, useState } from "react";
import { GithubEvent } from "../types/Github";
import GithubFeedItem from "./GithubFeedItem";

interface Props {
  // github URL
  github: string;
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function GithubFeed(props: Props) {
  let [githubEvents, setGithubEvents] = useState<GithubEvent[]>([]);
  let [error, setError] = useState<string>("");
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const usernameMatches = props.github.match(/https?:\/\/github.com\/(.+)/);
    // console.log(usernameMatches, usernameMatches?.length !== undefined, usernameMatches?.length === 2);
    if (usernameMatches && usernameMatches.length === 2){
      axios.get(`https://api.github.com/users/${usernameMatches[1]}/events?per_page=100`).then((res) => {
        let prOpenedEvents = res.data.filter((e: any) => e.type === "PullRequestEvent" && e.payload.action === "opened");
        setGithubEvents(prOpenedEvents)
      });
    } else {
      setError("The github url provided isn't valid :(");
    }
    setLoading(false);
  }, [props.github]);

  return (
    <>
      {error ?  
          <p>{error}</p>
        : 
          loading ? 
            <p>Loading...</p>
          :
            githubEvents.map((ghEvent:GithubEvent)=><GithubFeedItem githubEvent={ghEvent}/>)
      }
    </>
  )
}
