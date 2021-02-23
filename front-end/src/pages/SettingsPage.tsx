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
    const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + loggedInUser.loggedInUser.authorId + "/";
    const [eachEntry, setEachEntry] = useState(initialInputState);
    const { displayName, githubUrl } = eachEntry;
    const [unchangedData, setUnchangedData] = useState(initialInputState);

    function getAuthorData() {
        axios.get(authorUrl).then(res => {
            setUnchangedData(res.data);
            console.log(unchangedData)
        }).catch(err => {
            console.log("GET ERROR");
        })};

    const handleInputChange = (e: any) => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        getAuthorData();

        axios.post(authorUrl, {
            displayName: (displayName === "") ? unchangedData.displayName : displayName,
            github: (githubUrl === "") ? unchangedData.githubUrl : githubUrl,
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
                            type="text" // TODO add URL validation
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