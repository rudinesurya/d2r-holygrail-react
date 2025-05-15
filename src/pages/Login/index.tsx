import React, { useState } from "react";
import { Container, Form, Header, Segment, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const {loading, token, error} = useSelector((state: RootState) => state.auth.login);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginRequest(credentials));
        navigate('/');
    };

    const { email, password } = credentials;

    return (
        <Container text style={{ paddingTop: '2em' }}>
            <Header as="h1" textAlign="center">Login</Header>
            <Segment>
                <Form onSubmit={handleSubmit} error={!!error}>
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

                    {error && <Message error header="Login Error" content={error} />}

                    <Button type="submit" primary loading={loading} disabled={loading || !email || !password}>
                        Login
                    </Button>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Segment>
        </Container>
    );
};

export default Login;