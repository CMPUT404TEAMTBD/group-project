import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useState } from 'react';
import {
    Alert,
    Card,
    CardBody,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';
import { UserLogin } from '../types/UserLogin';
interface Props {
    loggedInUser: UserLogin | undefined;
}

/**
 * Renders Settings Page where an author can change their display name
 * and/or GitHub URL. 
 * @param props
 */
const SettingsPage = (props: Props) => {
    // https://reactstrap.github.io/components/form/#app
    // https://medium.com/better-programming/easily-create-a-form-with-react-hooks-1cab17e2be0d
    // setting state: https://stackoverflow.com/questions/45850550/accessing-data-from-axios-get-request

    const initialInputState = { displayName: undefined, githubUrl: undefined };
    const authorId = props.loggedInUser ? props.loggedInUser.authorId + "/" : "";
    const authorUrl = process.env.REACT_APP_API_URL + "/api/author/" + authorId;
    const [eachEntry, setEachEntry] = useState(initialInputState);
    const { displayName, githubUrl } = eachEntry;
    const [unchangedData, setUnchangedData] = useState(initialInputState);
    const [responseMessage, setResponseMessage] = useState(100);

    // get current author data
    function getAuthorData() {
        AxiosWrapper.get(authorUrl).then(res => {
            setUnchangedData(res.data);
        }).catch(err => {
            console.log("GET ERROR");
            setResponseMessage(500);
        })};

    const handleInputChange = (e: any) => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    };

    // on submitting any changes, update the author's display name
    // and/or GitHub URL. Blank inputs will not change the corresponding field(s)
    const handleSubmit = (e: any) => {
        e.preventDefault();
        getAuthorData();

        if (!displayName && !githubUrl) {
            setResponseMessage(400); // handle empty input
        } else {
            AxiosWrapper.post(authorUrl, {
                displayName: !displayName ? unchangedData.displayName : displayName,
                github: !githubUrl ? unchangedData.githubUrl : githubUrl,
            }).then(res => {
                console.log(res);
                setResponseMessage(res.status);
            }).catch(err => {
                console.log("POST ERROR")
                setResponseMessage(500);
            });
        }
    };

    // display alerts approrpiate to HTTP response(s)
    function displayResponse() {
        if (responseMessage > 499) {
            return <Alert color="danger">Error! Please try again</Alert>
        }
        if (responseMessage === 400) {
            return <Alert color="warning">Cannot submit empty form</Alert>
        }
        if (responseMessage > 199 && responseMessage < 300) {
            return <Alert color="success">Update successful!</Alert>
        }
        return null;
    }

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
                    {displayResponse()}
                </Form>
            </CardBody>
        </Card>
    );
}

export default SettingsPage;