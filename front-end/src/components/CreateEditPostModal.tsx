import axios, { AxiosRequestConfig } from "axios";
import React, { useState } from "react";
import { Alert, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UserLogin } from "../types/UserLogin";

interface Props {
  loggedInUser: UserLogin
  toggle: any
  isModalOpen: boolean
}

export default function CreatePostComponent(props: Props){

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [contentType, setContentType] = useState('Text');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([""])
  const [visibility, setVisibility] = useState('Public');
  const [unlisted, setUnlisted] = useState(false);
  const [showError, setShowError] = useState(false);

  function changeVisibility(isChecked: boolean) {
      if (isChecked) {
          setVisibility("Friends")
      }
      else {
          setVisibility("Public")
      }
  }

  function parseCategories(categories: string) {
      let parsed: string[] = categories.split(" ")
      setCategories(parsed);
  }

  function sendPost(e:any) {
      e.preventDefault();

      const data = {
        title: title,
        description: desc,
        visibility: visibility,
        unlisted: unlisted,
        contentType: contentType,
        content: content,
        categories: categories
      }
      const config:AxiosRequestConfig = {
        auth:{
          username:props.loggedInUser.username,
          password:props.loggedInUser.password
        }
      }

      axios.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/", data, config)
      .then(res => {
        if (res.status >= 400) {
          setShowError(true)
        } else if (res.status === 201) {
          console.log('WORKED!!!')
        }
      }).catch(error => {
        setShowError(true)
      })
  }

  return (
    <Modal isOpen={props.isModalOpen} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>EDIT/POST</ModalHeader>
    <ModalBody>
      <div>
          {showError ? <Alert>Could not create post</Alert> : null}
          <h1>Create Post</h1>
          <Form inline={true} onSubmit={e => sendPost(e)}>
            <FormGroup>
              <Input type="text" name="Title" placeholder="Title" onChange={e => setTitle(e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Description" placeholder="Description" onChange={e => setDesc(e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <Label for="Content Type">Content Type</Label>
              <select name="Content Type" onChange={e => setContentType(e.target.value)}>
                <option value="text/markdown">text/markdown</option>
                <option value="text/plain">text/plain</option>
                <option value="application/base64">application/base64</option>
                <option value="image/png;base64">image/png</option>
                <option value="image/jpeg;base64">image/jpeg</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Content" placeholder="Content" onChange={e => setContent(e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Categories" placeholder="Categories" onChange={e => parseCategories(e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <Input id="Visibility" type="checkbox" name="Visibility" placeholder="Unlisted" onChange={e => changeVisibility(e.target.checked)}/>
              <Label for="Visibility">Private</Label>
              <Input id="Unlisted" type="checkbox" name="Unlisted" placeholder="Unlisted" onChange={e => setUnlisted(e.target.checked)}/>
              <Label for="Unlisted">Unlisted</Label>
            </FormGroup>
            <FormGroup>
              <input type="submit" value="Submit" />
            </FormGroup>
          </Form>
      </div>
    </ModalBody>
    <ModalFooter>
      
    </ModalFooter>
  </Modal>
      
  )
}