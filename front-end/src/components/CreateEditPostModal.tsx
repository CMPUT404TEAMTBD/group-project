import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import React, { useState } from "react";
import { Alert, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Post } from "../types/Post";
import { UserLogin } from "../types/UserLogin";

interface Props {
  loggedInUser: UserLogin
  toggle: any
  isModalOpen: boolean
  editFields?: Post
}

/**
 * If editFields is not undefined, then this modal will act as an editing modal
 * @param props 
 */

export default function CreateEditPostModal(props: Props){

  const emptyPostFields = {
    title:'',
    description:'',
    contentType:'Text',
    content:'',
    categories:[''],
    visibility:'Public',
    unlisted:false
  }

  const postFields = props.editFields ?? emptyPostFields

  const [title, setTitle] = useState(postFields.title);
  const [desc, setDesc] = useState(postFields.description);
  const [contentType, setContentType] = useState(postFields.contentType);
  const [content, setContent] = useState(postFields.content);
  const [categories, setCategories] = useState<string[]>(postFields.categories);
  const [visibility, setVisibility] = useState(postFields.visibility);
  const [unlisted, setUnlisted] = useState(postFields.unlisted);
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

      if(props.editFields === undefined){
        axios.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/", data, config)
          .then(res => {
            handleRes(res)
          }).catch(error => {
            setShowError(true)
          })
      }
      else{
        axios.put(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/" + props.editFields.id, data, config)
          .then(res => {
            handleRes(res)
          }).catch(error => {
            setShowError(true)
          })
      }
  }

  function handleRes(res:AxiosResponse){
    if (res.status >= 400) {
      setShowError(true)
    } else if (res.status === 201) {
      props.toggle()
    }
  }

  return (
    <Modal isOpen={props.isModalOpen} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>{props.editFields === undefined ? "Create Post" : "Edit Post"}</ModalHeader>
    <ModalBody>
      <div>
          {showError ? <Alert>Could not modify post</Alert> : null}
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