import React, { useState } from "react";
import { Container, Form, Header, Segment, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    const handleRegister = async () => {
        setLoading(true);
        setError(null);

        try {
            // Call the registration API
            const registerResponse = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!registerResponse.ok) {
                throw new Error(`Registration Error: ${registerResponse.statusText}`);
            }

            // Automatically log in the user after successful registration
            const loginResponse = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                throw new Error(`Login Error: ${loginResponse.statusText}`);
            }

            const loginData = loginResponse;
            console.log('Login successful:', loginData);

            // alert('Registration and login successful! Redirecting to Dashboard...');
            navigate('/'); // Redirect to Dashboard
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container text style={{ paddingTop: '2em' }}>
            <Header as="h1" textAlign="center">Register</Header>
            <Segment>
                <Form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <Form.Field>
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Field>
                    <Button type="submit" primary loading={loading} disabled={loading || !email || !password}>
                        Register
                    </Button>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Segment>
        </Container>
    );
};

export default Register;