import React from "react"
import axios from 'axios';
import AuthorListItem from "./AuthorListItem"

export default class AuthorList extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            authors: [],
           
        }
    }

    componentDidMount(){
        axios.get(this.props.url.searchURL)
        .then(response => {
            let filteredresponse = response.data.results
            filteredresponse = filteredresponse.filter(author => author.displayName === this.props.displayName.searchDisplayName)
            this.setState({
                authors: filteredresponse
           });
        })
    }

    render(){
        return(
            <div>
               {this.state.authors.map(author => <AuthorListItem key = {author.id} displayName = {author.displayName} github = {author.github} id ={author.id}></AuthorListItem>)}
            </div>
        )
    }

}
   