import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { fetchConfigRequest } from "./redux/slices/config-slice";
import { useDispatch } from 'react-redux';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch an action to load the configuration.
        dispatch(fetchConfigRequest());
    }, [dispatch]);

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
