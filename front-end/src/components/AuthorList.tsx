import AuthorListItem from "./AuthorListItem"
import { Author } from "../types/Author";
import { UserLogin } from "../types/UserLogin";

interface Props {
  authorList: Author[];
  loggedInUser: UserLogin;
}

/**
 * Author list component to show list of authors
 * @param props
 */
export default function AuthorList(props: Props) {

  return (
    <>
      {props.authorList.length !== 0 ?
       props.authorList.map((author: Author) => <AuthorListItem author={author} loggedInUser={props.loggedInUser}></AuthorListItem>):
       <h4>No Authors Found :(</h4>
      }
    </>
  )
}
