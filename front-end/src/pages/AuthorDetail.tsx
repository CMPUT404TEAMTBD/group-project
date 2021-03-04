
import React from "react"
import axios from 'axios';

export default class AuthorDetail extends React.Component<any,any> {

    state = {
        author:[],
        
    };


    componentDidMount(){
        const URL = process.env.REACT_APP_API_URL + "/api/author/" +  this.props.match.params.id;
        axios.get(URL)
        .then(response => {
            console.log(response)
           this.setState({
                author: response.data
           });
        });
    };
   

    //todo: show author profile instead of id
    render(){

       return(
            <div>
                {this.props.match.params.id}
           
            </div>
       )
    }      
      
}
   