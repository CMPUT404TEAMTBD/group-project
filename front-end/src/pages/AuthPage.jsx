import React from "react";
import {
  Row,
  Col
} from 'reactstrap';

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Alert from "reactstrap/es/Alert";

/**
 * Component originally from
 * https://github.com/ChrisChrisLoLo/CoursePlusPlus/blob/master/frontend/src/components/auth/index.js
 * by ChrisChrisLoLo
 */

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {formType: "logIn"};
    this.changeForm = this.changeForm.bind(this);
  }

  changeForm(e, newForm) {
    this.setState({formType: newForm});
    e.preventDefault();
  }

  render() {
    console.log(this.state);
    let displayedForm = <h3>Form could not be found</h3>;
    switch (this.state.formType) {
      case "logIn":
        displayedForm = <LoginForm setLoggedInUser={this.props.setLoggedInUser} history={this.props.history} changeForm={this.changeForm}/>
        break;
      case "register":
        displayedForm = <RegisterForm setLoggedInUser={this.props.setLoggedInUser} history={this.props.history} changeForm={this.changeForm}/>
        break;
      default:
        console.error("Unknown form type!");
        break;
    }
    return (
      <div className={"my-2"}>
        <Row>
          <Col>
            <h3 className={"font-title"}>Login</h3>
          </Col>
        </Row>
        <Row>
          <Col xs="1" sm="2" md="3"></Col>
          <Col>
            {this.props.location.state && this.props.location.state.redirectReason &&
            <Alert color={"warning"}>{this.props.location.state.redirectReason}</Alert>
            }
            {displayedForm}
          </Col>
          <Col xs="1" sm="2" md="3"></Col>
        </Row>
      </div>
    );
  }
}