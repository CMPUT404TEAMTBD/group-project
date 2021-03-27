import { AxiosWrapper } from '../helpers/AxiosWrapper';
import { AxiosResponse } from 'axios';
import React, { useState } from "react";
import { Alert, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Post, PostContent, PostContentType, PostVisibility } from "../types/Post";
import { UserLogin } from "../types/UserLogin";
import { Author } from "../types/Author";
import PostContentEl from "./PostContentEl";

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
        AxiosWrapper.post(process.env.REACT_APP_API_URL + "/api/author/" + props.loggedInUser.authorId + "/posts/", data, props.loggedInUser)
          .then((post: any) => {
            handleRes(post)
            return post
          }).then((post: any) => {
            if (visibility === PostVisibility.FRIENDS) {
              // send this post to friends only
              AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}/friends/`, props.loggedInUser).then((res: any) => {
                let friendsList: Author[] = res.data.items;
                friendsList.forEach(friend => {
                  AxiosWrapper.post(`${friend.host}api/author/${friend.id}/inbox/`, post.data, props.loggedInUser);
                });
              })
            } else {
              // send this post to all followers (which are friends and followers)
              AxiosWrapper.get(`${process.env.REACT_APP_API_URL}/api/author/${props.loggedInUser.authorId}/followers/`, props.loggedInUser).then((res: any) => {
                let followingList: Author[] = res.data.items;
                followingList.forEach(follower => {
                  AxiosWrapper.post(`${follower.host}api/author/${follower.id}/inbox/`, post.data, props.loggedInUser);
                });
              });
            }
          }).catch((error: any) => {
            setShowError(true)
          })
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
    if (res.status >= 300) {
      setShowError(true)
    } else if (res.status >= 200) {
      const post:Post = res.data;
      if(isCreate){
        if(props.prependToFeed !== undefined){
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
          <Form inline={true} onSubmit={e => sendPost(e)}>
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
              <input type="submit" value="Submit" />
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