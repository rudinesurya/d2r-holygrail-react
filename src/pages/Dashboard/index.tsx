import React, { useState, useEffect } from "react";
import { Container, Form, Grid, Header, Segment, Button, Progress, Menu, Dropdown, List } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

const Dashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ found: number; total: number } | null>(null);
    const [uniqueItemsProgress, setUniqueItemsProgress] = useState<{ found: number; total: number } | null>(null);
    const [setItemsProgress, setSetItemsProgress] = useState<{ found: number; total: number } | null>(null);
    const [user, setUser] = useState<string | null>(null); // State to store logged-in user
    const [userId, setUserId] = useState<string | null>(null); // State to store logged-in user
    const [items, setItems] = useState<{ itemName: string; itemType: string; itemQuality: string }[]>([]);
    const [itemCounts, setItemCounts] = useState<{ userId: string; itemName: string; count: number }[]>([]);
    const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
    const [recentRecords, setRecentRecords] = useState<{ itemName: string; location: string; timestamp: Date }[]>([]); // State for recent records
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use the debounced value for searchTerm

    const navigate = useNavigate();

    useEffect(() => {
        if (debouncedSearchTerm.trim() !== '') {
            const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();

            // Prioritize matches that start with the search term
            const prioritizedSuggestions = items
                .filter((item) =>
                    item.itemName.toLowerCase().startsWith(lowerCaseSearchTerm)
                )
                .map((item) => {
                    const count = itemCounts.find(x => x.itemName === item.itemName && x.userId === userId)?.count || 0;
                    const label = count === 0 ? 'Missing' : `Found: ${count}`;
                    return `${item.itemName} -- ${item.itemType} -- ${item.itemQuality}${label ? ` -- ${label}` : ''}`;
                });

            // Include matches that contain the search term but don't start with it
            const secondarySuggestions = items
                .filter((item) =>
                    (item.itemName.toLowerCase().includes(lowerCaseSearchTerm) ||
                        item.itemType.toLowerCase().includes(lowerCaseSearchTerm))
                )
                .map((item) => {
                    const count = itemCounts.find(x => x.itemName === item.itemName && x.userId === userId)?.count || 0;
                    const label = count === 0 ? 'Missing' : `Found: ${count}`;
                    return `${item.itemName} -- ${item.itemType} -- ${item.itemQuality}${label ? ` -- ${label}` : ''}`;
                });

            // Combine prioritized and secondary suggestions
            const suggestions = Array.from(new Set([...prioritizedSuggestions, ...secondarySuggestions]));
            setItemSuggestions(suggestions);
        } else {
            setItemSuggestions([]);
        }
    }, [debouncedSearchTerm, items, itemCounts, userId]); // Fetch suggestions only when the debounced value, item lists, itemCounts, or userId change

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const [itemName] = selectedItem.split(' -- '); // Extract itemName from selectedItem
            const response = await fetch('http://localhost:3000/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    itemName,
                    location,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Record created:', data);
            // alert('Record successfully created!');

            setSearchTerm('');
            setSelectedItem('');
            fetchProgress();
            fetchRecentRecords();
            fetchItemCounts();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await fetch('http://localhost:3003/achievements/progress', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setProgress(data.progress);
            setUniqueItemsProgress(data.metadata.uniqueItemsProgress);
            setSetItemsProgress(data.metadata.setItemsProgress);
        } catch (err: any) {
            console.error('Failed to fetch progress:', err);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setUser(data.email); // Assuming the response contains the user's email
            setUserId(data._id);
        } catch (err: any) {
            console.error('Failed to fetch user:', err);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://localhost:3004/graphql`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query {
                            items {
                                itemName
                                itemQuality
                                itemType
                            }
                        }
                    `,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setItems(data.data.items);

        } catch (err: any) {
            console.error('Failed to fetch item suggestions:', err);
        }
    };

    const fetchRecentRecords = async () => {
        if (!userId)
            return;
        try {
            const response = await fetch(`http://localhost:3004/graphql`, {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query ($userId: String!) {
                            records(userId: $userId, sort: "-timestamp", limit: 10) {
                                itemName
                                location
                                timestamp
                            }
                        }
                    `,
                    variables: {
                        userId: userId,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setRecentRecords(data.data.records); // Assuming the response is an array of recent records
        } catch (err: any) {
            console.error('Failed to fetch recent records:', err);
        }
    };

    const fetchItemCounts = async () => {
        if (!userId)
            return;
        try {
            const response = await fetch(`http://localhost:3000/item-counts?userId=${userId}`, {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log(data);
            setItemCounts(data); // Assuming the response is an array of recent records
        } catch (err: any) {
            console.error('Failed to fetch recent records:', err);
        }
    };

    useEffect(() => {
        fetchProgress();
        fetchUser(); // Fetch the logged-in user's information
        fetchItems();
        fetchRecentRecords();
        fetchItemCounts();
    }, [userId]);

    const calculatePercentage = (found: number, total: number): number => {
        return total > 0 ? (found / total) * 100 : 0;
    };

    return (
        <Container text style={{ paddingTop: '2em' }}>
            {/* Top Menu Bar */}
            <Menu pointing secondary>
                <Menu.Item header>Diablo 2 Holy Grail</Menu.Item>
                <Menu.Menu position="right">
                    {user ? (
                        <Menu.Item>
                            Logged in as: <strong>{user}</strong>
                        </Menu.Item>
                    ) : (
                        <>
                            <Menu.Item onClick={() => navigate('/register')}>Register</Menu.Item>
                            <Menu.Item onClick={() => navigate('/login')}>Login</Menu.Item>
                        </>
                    )}
                </Menu.Menu>
            </Menu>

            {/* Form Section */}
            <Header as="h1" textAlign="center">Add New Item</Header>
            <Segment>
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Grid stackable columns={2}>
                        <Grid.Column width={16}>
                            <Form.Field>
                                <label>Item Name</label>
                                <Dropdown
                                    placeholder="Enter item name"
                                    fluid
                                    search
                                    selection
                                    value={selectedItem}
                                    onSearchChange={(_, data) => {
                                        console.log('Search query:', data.searchQuery); // Logs the user's search input
                                        setSearchTerm(data.searchQuery || '');
                                    }}
                                    onChange={(_, data) => {
                                        console.log('Selected value:', data.value); // Logs the selected value
                                        setSelectedItem(data.value as string);
                                    }}
                                    options={itemSuggestions.map((item, index) => ({
                                        key: `${item}-${index}`,
                                        text: item,
                                        value: item,
                                    }))}

                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Form.Field>
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Button type="submit" primary loading={loading} disabled={loading || !selectedItem}>
                                Submit
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Segment>

            {/* Progress Section */}
            <Segment>
                <Header as="h3">Progress</Header>
                {progress && (
                    <>
                        <p>Total Progress: {progress.found}/{progress.total}</p>
                        <Progress percent={calculatePercentage(progress.found, progress.total)} precision={2} progress />
                    </>
                )}
                {uniqueItemsProgress && (
                    <>
                        <p style={{ color: '#b8860b' }}>Unique Items Progress: {uniqueItemsProgress.found}/{uniqueItemsProgress.total}</p>
                        <Progress percent={calculatePercentage(uniqueItemsProgress.found, uniqueItemsProgress.total)} precision={2} progress color="brown" />
                    </>
                )}
                {setItemsProgress && (
                    <>
                        <p style={{ color: 'green' }}>Set Items Progress: {setItemsProgress.found}/{setItemsProgress.total}</p>
                        <Progress percent={calculatePercentage(setItemsProgress.found, setItemsProgress.total)} precision={2} progress color="green" />
                    </>
                )}
                {!progress && <p>Loading progress...</p>}
            </Segment>

            {/* Recent Records Section */}
            <Segment>
                <Header as="h3">Recent Additions</Header>
                <List divided relaxed>
                    {recentRecords.slice(0, 10).map((record, index) => (
                        <List.Item key={index}>
                            <List.Content>
                                <List.Header>{record.itemName}</List.Header>
                                <List.Description>
                                    Location: {record.location} | Added At: {new Date(record.timestamp).toLocaleString()} | Found: {itemCounts.find(x => x.itemName === record.itemName && x.userId === userId)?.count || 0}
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </Segment>
        </Container>
    );
};

export default Dashboard;
