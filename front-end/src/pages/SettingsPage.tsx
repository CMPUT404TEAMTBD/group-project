import { AxiosWrapper } from '../helpers/AxiosWrapper';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    CardBody,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    FormText,
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
    const authorId = props.loggedInUser ? props.loggedInUser.authorId + "/" : "";
    const authorUrl = `${process.env.REACT_APP_API_URL}/api/author/${authorId}`;
    const [responseMessage, setResponseMessage] = useState(100);
    const [displayName, setDisplayName] = useState<string>();
    const [github, setGithub] = useState<string>();

    // get current author data

    useEffect(() => {
        AxiosWrapper.get(authorUrl, props.loggedInUser).then((res: any) => {
            setDisplayName(res.data.displayName);
            setGithub(res.data.github);
            const github = res.data.github;
            // Show only the username part of the Github URL 
            setGithub(github?.substring(github.lastIndexOf("/") + 1));
        }).catch((err: any) => {
            console.error(err);
            setResponseMessage(500);
        });
    }, []);


    // on submitting any changes, update the author's display name
    // and/or GitHub URL. Blank inputs will not change the corresponding field(s)
    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!displayName && !github) {
            setResponseMessage(400); // handle empty input
        } else {
            AxiosWrapper.post(authorUrl, {
                displayName,
                github: `https://github.com/${github}`
            }, props.loggedInUser).then((res: any) => {
                setResponseMessage(res.status);
            }).catch((err: any) => {
                console.error(err);
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
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="githubUrl">GitHub Username</Label>
                        <Input
                            type="text" // TODO add URL validation
                            name="githubUrl"
                            id="githubUrl"
                            placeholder="New GitHub Username"
                            onChange={(e) => setGithub(e.target.value)}
                            value={github}
                        />
                        <FormText color="muted">
                            e.g. johndoe
                        </FormText>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit">Submit</Button>
                    </FormGroup>
                    {displayResponse()}
                </Form>
            </CardBody>
        </Card>
    );
}

export default SettingsPage;