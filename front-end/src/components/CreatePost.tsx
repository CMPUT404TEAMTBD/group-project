import axios from 'axios';
import React, { useState } from 'react';
import { Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { Form, Input } from 'reactstrap';

const CreatePostComponent = (props: any) => {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [contentType, setContentType] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState('');
    const [visibility, setVisibility] = useState('Public');
    const [unlisted, setUnlisted] = useState(false);

    function changeVisibility(isChecked: boolean) {
        if (isChecked) {
            setVisibility("Friends")
        }
        else {
            setVisibility("Public")
        }
    }

    function sendPost(e:any) {
        let data = {
            title: title,
            description: desc,
            visibility: visibility,
            unlisted: unlisted,
            contentType: contentType,
            content: content,
            categories: [categories]
        }

        console.log(data)
        axios.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/", data)
    }

    return (
        <div>
            <h1>Create Post</h1>
            <Form inline={true} onSubmit={e => sendPost(e)}>
                <Input type="text" name="Title" placeholder="Title" onChange={e => setTitle(e.target.value)}/>
                <Input type="text" name="Description" placeholder="Description" onChange={e => setDesc(e.target.value)}/>
                <Input type="text" name="Content Type" placeholder="Content Type" onChange={e => setContentType(e.target.value)}/>
                <Input type="text" name="Content" placeholder="Content" onChange={e => setContent(e.target.value)}/>
                <Input type="text" name="Categories" placeholder="Categories" onChange={e => setCategories(e.target.value)}/>
                <Input id="Visibility" type="checkbox" name="Visibility" placeholder="Unlisted" onChange={e => changeVisibility(e.target.checked)}/>
                <Label for="Visibility">Private</Label>
                <Input id="Unlisted" type="checkbox" name="Unlisted" placeholder="Unlisted" onChange={e => setUnlisted(e.target.checked)}/>
                <Label for="Unlisted">Unlisted</Label>
                <input type="submit" value="Submit" />
            </Form>
        </div>
        
    )
}

export default CreatePostComponent