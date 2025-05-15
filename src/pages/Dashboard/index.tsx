import React, { useState, useEffect } from "react";
import { Container, Form, Grid, Header, Segment, Button, Progress, Menu, Dropdown, List } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchItemsRequest } from "../../redux/slices/items-slice";
import { createRecordRequest, fetchRecordsRequest } from "../../redux/slices/records-slice";
import { fetchStashRequest } from "../../redux/slices/stash-slice";
import { fetchUserRequest } from "../../redux/slices/auth-slice";

const Dashboard: React.FC = () => {
    // Auth
    const { userId, email } = useSelector((state: RootState) => state.auth.fetchUser);

    // Creating Record
    const [searchTerm, setSearchTerm] = useState('');
    const [itemSuggestions, setItemSuggestions] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [location, setLocation] = useState('');
    const { loading, error } = useSelector((state: RootState) => state.records.createRecord);
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // Use the debounced value for searchTerm

    // Tracking Progress
    const [progress, setProgress] = useState({ found: 0, total: 519 });
    const [uniqueItemsProgress, setUniqueItemsProgress] = useState({ found: 0, total: 392 });
    const [setItemsProgress, setSetItemsProgress] = useState({ found: 0, total: 127 });
    const { recentRecords } = useSelector((state: RootState) => state.records.fetchRecentRecords);

    // Other Metadata
    const { items } = useSelector((state: RootState) => state.items);
    const { stash } = useSelector((state: RootState) => state.stash);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(fetchUserRequest());
    }, []);

    useEffect(() => {
        dispatch(fetchItemsRequest());
        dispatch(fetchRecordsRequest());
        dispatch(fetchStashRequest());
    }, [userId]);

    useEffect(() => {
        if (debouncedSearchTerm.trim() !== '') {
            const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();

            // Prioritize matches that start with the search term
            const prioritizedSuggestions = items
                .filter((item) =>
                    item.itemName?.toLowerCase().startsWith(lowerCaseSearchTerm)
                )
                .map((item) => {
                    const count = stash.find(x => x.itemName === item.itemName && x.userId === userId)?.count || 0;
                    const label = count === 0 ? 'Missing' : `Found: ${count}`;
                    return `${item.itemName} -- ${item.itemType} -- ${item.itemQuality}${label ? ` -- ${label}` : ''}`;
                });

            // Include matches that contain the search term but don't start with it
            const secondarySuggestions = items
                .filter((item) =>
                (item.itemName?.toLowerCase().includes(lowerCaseSearchTerm) ||
                    item.itemType?.toLowerCase().includes(lowerCaseSearchTerm))
                )
                .map((item) => {
                    const count = stash.find(x => x.itemName === item.itemName && x.userId === userId)?.count || 0;
                    const label = count === 0 ? 'Missing' : `Found: ${count}`;
                    return `${item.itemName} -- ${item.itemType} -- ${item.itemQuality}${label ? ` -- ${label}` : ''}`;
                });

            // Combine prioritized and secondary suggestions
            const suggestions = Array.from(new Set([...prioritizedSuggestions, ...secondarySuggestions]));
            setItemSuggestions(suggestions);
        } else {
            setItemSuggestions([]);
        }
    }, [debouncedSearchTerm, items, stash, userId]); // Fetch suggestions only when the debounced value, item lists, itemCounts, or userId change

    useEffect(() => {
        if (!items.length || !stash.length || !userId) return;

        // Filter unique and set items
        const uniqueItems = items.filter(item => item.itemQuality === 'Unique');
        const setItems = items.filter(item => item.itemQuality === 'Set');

        // Count how many unique/set items have been collected by the user
        const foundUnique = uniqueItems.filter(item =>
            stash.some(s => s.itemName === item.itemName && s.userId === userId && s.count > 0)
        ).length;

        const foundSet = setItems.filter(item =>
            stash.some(s => s.itemName === item.itemName && s.userId === userId && s.count > 0)
        ).length;

        setProgress({ found: foundUnique + foundSet, total: (uniqueItems.length + setItems.length) });
        setUniqueItemsProgress({ found: foundUnique, total: uniqueItems.length });
        setSetItemsProgress({ found: foundSet, total: setItems.length });
    }, [items, stash, userId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const [itemName] = selectedItem.split(' -- '); // Extract itemName from selectedItem
            dispatch(createRecordRequest({ itemName, location }))
            setSearchTerm('');
            setSelectedItem('');
            // fetchProgress();
            dispatch(fetchRecordsRequest());
            dispatch(fetchStashRequest());
        } catch (err: any) {
            console.error(err);
        } finally {
        }
    };


    const calculatePercentage = (found: number, total: number): number => {
        return total > 0 ? (found / total) * 100 : 0;
    };

    return (
        <Container text style={{ paddingTop: '2em' }}>
            {/* Top Menu Bar */}
            <Menu pointing secondary>
                <Menu.Item header>Diablo 2 Holy Grail</Menu.Item>
                <Menu.Menu position="right">
                    {email ? (
                        <Menu.Item>
                            Logged in as: <strong>{email}</strong>
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
                <Form onSubmit={handleSubmit}>
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
                                    Location: {record.location} | Added At: {record.timestamp?.toLocaleString()} | Found: {stash.find(x => x.itemName === record.itemName && x.userId === userId)?.count || 0}
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