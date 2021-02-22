import axios from 'axios';
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

const SettingsPage = (loggedInUser: any) => {
    // https://reactstrap.github.io/components/form/#app
    // https://medium.com/better-programming/easily-create-a-form-with-react-hooks-1cab17e2be0d
    // setting state: https://stackoverflow.com/questions/45850550/accessing-data-from-axios-get-request

    const initialInputState = { displayName: "", githubUrl: "" };
    const [eachEntry, setEachEntry] = useState(initialInputState);
    const { displayName, githubUrl } = eachEntry;

    const handleInputChange = (e: any) => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // TODO: handle empty input
        axios.post(process.env.REACT_APP_API_URL + "/api/author/" + loggedInUser.loggedInUser.authorId + "/", {
            displayName: displayName,
            github: githubUrl,
        }).then(res => {
            console.log(res);
            console.log(res.data);
        }).catch(err => {
            console.log("POST ERROR");
        });
    };

    return (
        <Card>
            <CardBody>
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
                            type="text" // TODO add form validation?
                            name="githubUrl"
                            id="githubUrl"
                            placeholder="New GitHub Account"
                            onChange={handleInputChange}
                            value={githubUrl}
                        />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </Form>
            </CardBody>
        </Card>
    );
}

export default SettingsPage;