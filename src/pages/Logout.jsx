import { Navigate } from 'react-router-dom';
import { REFRESH_TOKEN } from '../constraints';
import api from '../api';
import { logoutSuccess } from "./auth.js";
import { useDispatch } from 'react-redux';
import { persistor } from '../app/store.js';

function Logout() {
    const dispatch = useDispatch();
    let refresh = localStorage.getItem(REFRESH_TOKEN); 

    const handleLogout = async () => {
        try {
            const response = await api.post('auth/logout/', { refresh });
            dispatch(logoutSuccess(response));
            
            // Clear the persisted Redux state
            await persistor.purge();
            
            // Clear local storage
            localStorage.clear();
        } catch (error) {
            alert(`Error during logout: ${error.message}`);
            await persistor.purge();
            localStorage.clear();
        }
    };

    handleLogout();

    return <Navigate to="/login" />;
}

export default Logout;