import { Card, CardBody, CardTitle } from "reactstrap";
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
    <div>
      {props.likesList?.length !== 0 ?
       props.likesList?.map((like: Like, i) => <LikeListItem like={like} key={i}/>):
       <Card body className="text-center"><CardBody><CardTitle tag="h5" >No likes found. Everyone hates you :(</CardTitle></CardBody></Card>
      }
    </div>
  )
}
