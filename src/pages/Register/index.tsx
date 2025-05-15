import React, { useState } from "react";
import { Container, Form, Header, Segment, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { registerRequest, loginRequest } from "../../redux/slices/auth-slice";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const {
        loading: registerLoading,
        error: registerError,
    } = useSelector((state: RootState) => state.auth.register);

    const {
        loading: loginLoading,
        error: loginError,
    } = useSelector((state: RootState) => state.auth.login);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerRequest(credentials));
        dispatch(loginRequest(credentials));
        navigate('/');
    };

    const { email, password } = credentials;

    return (
        <Container text style={{ paddingTop: '2em' }}>
            <Header as="h1" textAlign="center">Register</Header>
            <Segment>
                <Form onSubmit={handleSubmit}>
                    <Form.Input
                        label="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />

                    {(registerError) && <Message error header="Registration Error" content={registerError} />}
                    {(loginError) && <Message error header="Login Error" content={loginError} />}

                    <Button type="submit" primary loading={registerLoading} disabled={registerLoading || !email || !password}>
                        Register
                    </Button>
                </Form>
            </Segment>
        </Container>
    );
};

export default Register;