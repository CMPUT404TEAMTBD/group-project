import axios from 'axios';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Post } from '../types/Post';
import { Form, Input } from 'reactstrap';

export default function CreatePostComponent() {
    
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [contentType, setContentType] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState('');
    const [visibility, setVisibility] = useState('');
    const [unlisted, setUnlisted] = useState('');

    function sendPost(e:any) {
        axios.post(process.env.REACT_APP_API_URL + "/api/author/username/posts/", {
            title: title,
            description: desc,
            visibility: visibility,
            unlisted: unlisted,
            contentType: contentType,
            content: content,
            categories: categories
        })
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
                <Input type="text" name="Visibility" placeholder="Visibility" onChange={e => setVisibility(e.target.value)}/>
                <Input type="text" name="Unlisted" placeholder="Unlisted" onChange={e => setUnlisted(e.target.value)}/>
                <input type="submit" value="Submit" />
            </Form>
        </div>
        
    )

}