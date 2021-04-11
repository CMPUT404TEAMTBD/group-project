import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { AxiosResponse } from 'axios';
import React, { useState } from "react";
import { Alert, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Post, PostContent, PostContentType, PostVisibility } from "../types/Post";
import { UserLogin } from "../types/UserLogin";
import { Author } from "../types/Author";
import { ResponseHelper } from "../helpers/ResponseHelper"
import PostContentEl from "./PostContentEl";
import * as Style from '../assets/createPostUI';
import {v4 as uuidv4} from 'uuid';


interface Props {
  loggedInUser: UserLogin
  toggle: any
  isModalOpen: boolean
  // These are fields of a post that you want to edit. If this is undefined, the modal will create posts.
  // If defined, modal will edit an existing post.
  editFields?: Post
  // Used to append the created post to the feed. Otherwise the feed will be outdated
  prependToFeed?: Function
  // Used to edit an existing post in the feed
  modifyInFeed?: Function

}

/**
 * Create Post or Edit Post Modal for creating and editing posts
 * If editFields is not undefined, then this modal will act as an editing modal
 * @param props 
 */
export default function CreateEditPostModal(props: Props){

  const emptyPostFields = {
    title:'',
    description:'',
    contentType: PostContentType.PLAIN_TEXT,
    content:'',
    categories:[''],
    visibility: PostVisibility.PUBLIC,
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
  const [uuid, setuuid] = useState<string>("");

  function changeVisibility(isChecked: boolean) {
      if (isChecked) {
          setVisibility(PostVisibility.FRIENDS)
      }
      else {
          setVisibility(PostVisibility.PUBLIC)
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
    setContent(emptyPostFields.contentType as PostContentType)
    setCategories(emptyPostFields.categories)
    setVisibility(emptyPostFields.visibility)
    setUnlisted(emptyPostFields.unlisted)
  }

  function parseCategories(categories: string) {
      let parsed: string[] = categories.split(" ")
      setCategories(parsed);
  }

  
  function generateUUID(e:any){
    e.preventDefault();
    return uuidv4();
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

      if(isCreate){
        if (uuid === ""){
          let post: Post | undefined = undefined;
          AxiosWrapper.post(`${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}/posts/`, data, props.loggedInUser)
          .then((res: any) => {
            handleRes(res)
            post = res.data;

            const urlPrefix = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}`;
            const authorsUrl = visibility === PostVisibility.FRIENDS ? `${urlPrefix}/friends/` : `${urlPrefix}/followers/`;

            return AxiosWrapper.get(authorsUrl, props.loggedInUser);
          }).then((res: any) => {
            let authors: Author[] = res.data.items;
            authors.forEach(a => {
              AxiosWrapper.post(`${a.host}api/author/${a.id}/inbox/`, post, props.loggedInUser);
            });
          }).catch((error: any) => {
            setShowError(true)
          })

        }
        else{
          let post: Post | undefined = undefined;
          AxiosWrapper.put(`${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}/posts/${uuid}/`, data, props.loggedInUser)
          .then((res: any) => {
            handleRes(res)
            post = res.data;

            const urlPrefix = `${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}`;
            const authorsUrl = visibility === PostVisibility.FRIENDS ? `${urlPrefix}/friends/` : `${urlPrefix}/followers/`;

            return AxiosWrapper.get(authorsUrl, props.loggedInUser);
          }).then((res: any) => {
            let authors: Author[] = res.data.items;
            authors.forEach(a => {
              AxiosWrapper.post(`${a.host}api/author/${a.id}/inbox/`, post, props.loggedInUser);
            });
          }).catch((error: any) => {
            setShowError(true)
          })
        }
      }

      else if(props.editFields !== undefined){
          AxiosWrapper.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/" + props.editFields.id + "/", data, props.loggedInUser)
          .then((res: any) => {
            handleRes(res)
          }).catch((err: any) => {
            setShowError(true)
          })
        } 
  }

  function handleRes(res:AxiosResponse){
    if (ResponseHelper.isSuccess(res)) {
      const post:Post = res.data;
      if(isCreate){
        if(props.prependToFeed !== undefined && post.visibility === PostVisibility.PUBLIC && !post.unlisted){
          props.prependToFeed(post)
        }
        resetFormAndToggle()
      } else {
        // We do not want to wipe the fields on our form when we edit,
        // or else we lose all of the loaded post information from the API
        if(props.modifyInFeed !== undefined){
          props.modifyInFeed(post)
        }
        props.toggle()
      }
    } else {
      setShowError(true)
    }
  }

  // Code from Дмитрий Васильев, https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
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

  const postContent:PostContent = {
    contentType:contentType,
    content:content
  }

  return (
    <Modal isOpen={props.isModalOpen} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>{isCreate ? "Create Post" : "Edit Post"}</ModalHeader>
    <ModalBody>
      <div>
          {showError ? <Alert>Could not modify post</Alert> : null}
          <Form inline={true} onSubmit={e => {sendPost(e); setuuid("")}}>
            <FormGroup>
              <Input type="text" name="Title" placeholder="Title" onChange={e => setTitle(e.target.value)} value={title}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Description" placeholder="Description" onChange={e => setDesc(e.target.value)} value={desc}/>
            </FormGroup>
            <FormGroup>
              <Label for="Content Type">Content Type</Label>
              <select name="Content Type" onChange={e => setContentType(e.target.value as PostContentType)} value={contentType}>
                <option value={PostContentType.PLAIN_TEXT}>text/plain</option>
                <option value={PostContentType.MARKDOWN}>text/markdown</option>
                <option value={PostContentType.APPLICATION}>application/base64</option>
                <option value={PostContentType.PNG}>image/png</option>
                <option value={PostContentType.JPEG}>image/jpeg</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Input type="textarea" name="Content" placeholder="Content" onChange={e => setContent(e.target.value)} value={content}/>
              <Input type="file" name="File" placeholder="File" onChange={e => fileToImageContent(e.target.files)}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="Categories" placeholder="Categories" onChange={e => parseCategories(e.target.value)} value={categories.join(' ')}/>
            </FormGroup>
            <FormGroup>
              <Input id="Visibility" type="checkbox" name="Visibility" placeholder="Visibility" onChange={e => changeVisibility(e.target.checked)} defaultChecked={visibility===PostVisibility.FRIENDS}/>
              <Label for="Visibility">Private</Label>
              <Input id="Unlisted" type="checkbox" name="Unlisted" placeholder="Unlisted" onChange={e => setUnlisted(e.target.checked)} defaultChecked={unlisted}/>
              <Label for="Unlisted">Unlisted</Label>
            </FormGroup>
            <FormGroup>
              <span>{uuid? uuid : null}</span>
              <input style = {Style.buttonStyle} type="submit" value="Submit" />
              <button style = {Style.buttonStyle} onClick = {e=>{setuuid(generateUUID(e));}}>Generate UUID</button>
            </FormGroup>
          </Form>
          <PostContentEl postContent={postContent} isPreview={false}/>
      </div>
    </ModalBody>
    <ModalFooter>
      
    </ModalFooter>
  </Modal>
      
  )
}