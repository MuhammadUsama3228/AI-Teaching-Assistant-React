import { Navigate } from 'react-router-dom'; // Ensure Navigate is imported from react-router-dom
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constraints'; // Make sure to import ACCESS_TOKEN if needed
import api from '../api'; // Import the api module for making requests

function Logout() {

    let refresh = localStorage.getItem(REFRESH_TOKEN); 

    const handleLogout = async () => {
        try {
            const response = await api.post('auth/logout/', { refresh });

        } catch (error) {
            alert(`Error during logout: ${error.message}`);
        } finally {
            localStorage.clear();
        }
    };

    handleLogout();

    return <Navigate to="/login" />;
}

export default Logout;