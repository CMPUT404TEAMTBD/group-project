import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import React, { useState } from "react";
import { Alert, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { preProcessFile } from "typescript";
import { Post } from "../types/Post";
import { UserLogin } from "../types/UserLogin";

interface Props {
  loggedInUser: UserLogin
  toggle: any
  isModalOpen: boolean
  // These are fields of a post that you want to edit. If this is undefined, the modal will create posts.
  // If defined, modal will edit an existing post.
  editFields?: Post
  // Used to append the created post to the feed. Otherwise the feed will be outdated
  prependToFeed?: Function
}

/**
 * If editFields is not undefined, then this modal will act as an editing modal
 * @param props 
 */
export default function CreateEditPostModal(props: Props){

  const emptyPostFields = {
    title:'',
    description:'',
    contentType:'text/plain',
    content:'',
    categories:[''],
    visibility:'Public',
    unlisted:false
  }

  const postFields = props.editFields ?? emptyPostFields
  const isCreate = props.editFields === undefined

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
  
  /**
   * Reset form fields and close modal. To be used when submission is successful
   */
  function resetFormAndToggle(){
    resetFormFields();
    props.toggle();
  }

  /**
   * Reset the forms of the modal, as closing the modal alone does _not_ reset the form fields
   */
  function resetFormFields(){
    setTitle(emptyPostFields.title)
    setDesc(emptyPostFields.description)
    setContentType(emptyPostFields.contentType)
    setContent(emptyPostFields.contentType)
    setCategories(emptyPostFields.categories)
    setVisibility(emptyPostFields.visibility)
    setUnlisted(emptyPostFields.unlisted)
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

      if(isCreate){
        axios.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/", data, config)
          .then(res => {
            handleRes(res)
          }).catch(error => {
            setShowError(true)
          })
      }
      else if(props.editFields !== undefined){
          axios.put(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/" + props.editFields.id + "/", data, config)
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
      if(isCreate){
        const post:Post = res.data;
        if(props.prependToFeed !== undefined){
          props.prependToFeed(post)
        }
      }
      resetFormAndToggle()
    }
  }

  //Code from Дмитрий Васильев, https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  const toBase64 = (file:File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function fileToImageContent(files:any)
  { 
    if(files && files.length >= 1){
      const result: any = await toBase64(files[0])
      setContent(result)
    }
  }

  return (
    <Modal isOpen={props.isModalOpen} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>{isCreate ? "Create Post" : "Edit Post"}</ModalHeader>
    <ModalBody>
      <div>
          {showError ? <Alert>Could not modify post</Alert> : null}
          <Form inline={true} onSubmit={e => sendPost(e)}>
            <FormGroup>
              <Input type="text" name="Title" placeholder="Title" onChange={e => setTitle(e.target.value)} value={title}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Description" placeholder="Description" onChange={e => setDesc(e.target.value)} value={desc}/>
            </FormGroup>
            <FormGroup>
              <Label for="Content Type">Content Type</Label>
              <select name="Content Type" onChange={e => setContentType(e.target.value)} value={contentType}>
                <option value="text/plain">text/plain</option>
                <option value="text/markdown">text/markdown</option>
                <option value="application/base64">application/base64</option>
                <option value="image/png;base64">image/png</option>
                <option value="image/jpeg;base64">image/jpeg</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Content" placeholder="Content" onChange={e => setContent(e.target.value)} value={content}/>
              <Input type="file" name="File" placeholder="File" onChange={e => fileToImageContent(e.target.files)}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Categories" placeholder="Categories" onChange={e => parseCategories(e.target.value)} value={categories.join(' ')}/>
            </FormGroup>
            <FormGroup>
              <Input id="Visibility" type="checkbox" name="Visibility" placeholder="Visibility" onChange={e => changeVisibility(e.target.checked)} defaultChecked={visibility==="Friends"}/>
              <Label for="Visibility">Private</Label>
              <Input id="Unlisted" type="checkbox" name="Unlisted" placeholder="Unlisted" onChange={e => setUnlisted(e.target.checked)} defaultChecked={unlisted}/>
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