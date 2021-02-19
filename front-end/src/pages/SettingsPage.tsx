import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input } from 'reactstrap';
// import axios from "axios";
import {
    Button,
    FormGroup,
    Label,
} from 'reactstrap';

const SettingsPage = (props: RouteComponentProps) => {
    // https://reactstrap.github.io/components/form/#app
    // https://medium.com/better-programming/easily-create-a-form-with-react-hooks-1cab17e2be0d
    const initialInputState = { displayName: "", githubUrl: "" };
    const [eachEntry, setEachEntry] = useState(initialInputState);
    const { displayName, githubUrl } = eachEntry;

    const handleInputChange = (e: any) => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(eachEntry);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="displayName">Display Name</Label>
                <Input
                    type="text"
                    name="displayName"
                    id="displayName"
                    placeholder="New Display Name"
                    onChange={handleInputChange}
                    value={displayName}
                />
            </FormGroup>
            <FormGroup>
                <Label for="githubUrl">GitHub Account</Label>
                <Input
                    type="text" // add form validation?
                    name="githubUrl"
                    id="githubUrl"
                    placeholder="New GitHub Account"
                    onChange={handleInputChange}
                    value={githubUrl}
                />
            </FormGroup>
            <Button type="submit">Submit</Button>
        </Form>
    );
}

export default SettingsPage;