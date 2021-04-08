import React from "react";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import axios from 'axios';

/**
 * Originally from
 * https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/components/auth/RegisterForm.js
 * by ChrisChrisLoLo
 * 
 * Registration form to allow authors to register if they don't have an existing account
 * @param props
 */

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: "", password: "", passwordConf: "", displayName: "", github: "", registerErr: false}

    this.attemptRegister = this.attemptRegister.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfChange = this.handlePasswordConfChange.bind(this);
    this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
    this.handleGithubChange = this.handleGithubChange.bind(this);
  }


  attemptRegister(e) {
    axios.post(process.env.REACT_APP_API_URL + "/api/rest-auth/registration/", {
      username: this.state.username,
      password1: this.state.password,
      password2: this.state.passwordConf
    }).then(_ => {
      return axios.get(process.env.REACT_APP_API_URL + `/api/auth-user/${this.state.username}/`);
    }).then(user => {
      return axios.post(`${process.env.REACT_APP_API_URL}/api/author/${user.data.id}/`, {
        displayName: this.state.displayName,
        github: `https://github.com/${this.state.github}` 
      })
    }).then(user => {
      this.props.setLoggedInUser({username: this.state.username, password: this.state.password, authorId: user.data.id, host: user.data.host});
      this.props.history.push("/");
    }).catch(err => {
      this.setState({registerErr: err.response});
    });
    e.preventDefault();
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handlePasswordConfChange(e) {
    this.setState({passwordConf: e.target.value});
  }

  handleDisplayNameChange(e) {
    this.setState({displayName: e.target.value});
  }

  handleGithubChange(e) {
    this.setState({github: e.target.value});
  }

  render() {
    const errData = this.state.registerErr.data;
    const errMessage = errData ? <Alert color="danger"> Could not register </Alert> : null;

    let errMesUsername = null;
    let errMesPassword1 = null;
    let errMesPassword2 = null;
    let errMesDisplayName = null;
    let errMesGithub = null;

    if (errData) {
      errMesUsername = errData.username ? <FormFeedback>{errData.username}</FormFeedback> : null;
      errMesPassword1 = errData.password1 ? <FormFeedback>{errData.password1}</FormFeedback> : null;
      errMesPassword2 = errData.password2 ? <FormFeedback>{errData.password2}</FormFeedback> : null;
      errMesDisplayName = errData.displayName ? <FormFeedback>{errData.displayName}</FormFeedback> : null;
      errMesGithub = errData.github ? <FormFeedback>{errData.github}</FormFeedback> : null;
    }
    return (
      <Card>
        <CardHeader className={"font-title"}>Register</CardHeader>
        <CardBody>
          <Form>
            {errMessage}
            <FormGroup>
              <Label for="username">Username</Label>
              <Input type="text" id="username" onChange={this.handleUsernameChange} value={this.state.username}
                     required={true} invalid={errMesUsername}/>
              {errMesUsername}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" id="password" onChange={this.handlePasswordChange} value={this.state.password}
                     invalid={errMesPassword1}/>
              {errMesPassword1}
            </FormGroup>
            <FormGroup>
              <Label for="passwordConf">Confirm Password</Label>
              <Input type="password" id="passwordConf" onChange={this.handlePasswordConfChange}
                     value={this.state.passwordConf} invalid={errMesPassword2}/>
              {errMesPassword2}
            </FormGroup>
            <FormGroup>
              <Label for="displayName">Display Name</Label>
              <Input type="text" id="displayName" onChange={this.handleDisplayNameChange} value={this.state.displayName}
                     required={true} invalid={errMesDisplayName}/>
              {errMesDisplayName}
            </FormGroup>
            <FormGroup>
              <Label for="github">GitHub Username (optional)</Label>
              <Input type="text" id="github" onChange={this.handleGithubChange} value={this.state.github}
                     required={true} invalid={errMesGithub}/>
              {errMesGithub}
            </FormGroup>
            <Button onClick={this.attemptRegister}>Register</Button>
            <Button onClick={(e) => this.props.changeForm(e, "logIn")} color="link">Log In</Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}