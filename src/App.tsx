import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { fetchConfigRequest } from "./redux/slices/config-slice";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRequest } from './redux/slices/auth-slice';
import { RootState } from './redux/store';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const authBaseUri = useSelector((state: RootState) => state.config.authBaseUri);

    useEffect(() => {
        // Dispatch an action to load the configuration.
        dispatch(fetchConfigRequest());
    }, [dispatch]);

    useEffect(() => {
        if (authBaseUri) {
            dispatch(fetchUserRequest());
        }
    }, [authBaseUri, dispatch]);

    return (
        <Router basename="/"> {/* Add basename here */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
