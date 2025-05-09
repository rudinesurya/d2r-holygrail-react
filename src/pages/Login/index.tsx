import React, { useState } from "react";
import { Container, Form, Header, Segment, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom"; 

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = response;
            console.log('Login successful:', data);
            // alert('Login successful! Redirecting to Dashboard...');
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
            <Header as="h1" textAlign="center">Login</Header>
            <Segment>
                <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                        Login
                    </Button>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Segment>
        </Container>
    );
};

export default Login;