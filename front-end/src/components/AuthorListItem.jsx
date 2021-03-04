import React from "react"

export default class AuthorListItem extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            id: props.id,
            displayName: props.displayName,
            github: props.github,
            
        };
    };

    render(){
        return(
        <div >

            <div >
                <h3 >{this.state.displayName} {this.state.github}</h3>   
            </div>
          

            <div>
                <a href = {`/author_detail/${this.state.id}`} >
                view profile
                </a>

               
            </div>
            
        </div>
           
        )
    }

}
   