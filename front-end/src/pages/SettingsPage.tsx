import axios from 'axios';
import { url } from 'inspector';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
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
    const initialInputState = { displayName: "", githubUrl: "" };
    const [eachEntry, setEachEntry] = useState(initialInputState);
    const { displayName, githubUrl } = eachEntry;
    const authorOb = {
        displayName: "",
        github: "",
        url: "",
        _id: "",
        _type: "",
    };
    const [adata, setAdata] = useState(authorOb);

    const handleInputChange = (e: any) => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const test_author = "whomsdt";

        axios.get(process.env.REACT_APP_API_URL + "/api/authors/").then(res =>{
            res.data.results.forEach((author: any) => {
                if (author.displayName == test_author) {
                    setAdata(author);
                }
            });
        }).catch(err => {
            console.log("ERROR");
        });
        console.log(adata.url);
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
            </CardBody>
        </Card>
    );
}

export default SettingsPage;