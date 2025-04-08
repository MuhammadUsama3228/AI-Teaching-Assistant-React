import { useState, useEffect } from 'react';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constraints.js";
import { loginSuccess } from './auth';
import { useDispatch } from 'react-redux';

function Login() {

    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Login | AI Teaching Assistant";
    }, []);

    const [loading, setLoading] = useState(false);


    const getProfile = async () => {
        try {
            const res = await api.get('/api/manage_profile/');

            if (res.status === 200) {
                dispatch(setUser(res.data));
                navigate('/teacherpanel'); // Ensure navigation happens after fetching profile
            const profile_role= await api.get('/api/manage_profile/');
            console.log(profile_role.data.role);  // Correct access to role
    
            if (profile_role.status === 200) {
                dispatch(setUser(profile_role.data));  // Use response, not res
            } else {
                console.error('Unexpected response status:', res.status);
                console.error('Unexpected response status:', profile_role.status);
            }
    
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            console.log('Profile fetch completed.');
        }
    };

    const handleProfileNavigation = async () => {
        try {
            const response = await api.get('/api/manage_profile/');
            const role = response.data.role;
    
            if (role === 'teacher') {
                navigate('/teacherpanel');
            } else if (role === 'student') {
                navigate('/studentpanel');  
            } else {
                console.error('Unknown role:', role);
            }
        } catch (error) {
            console.error('Error during profile navigation:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.preventDefault(); 
        setLoading(true);
        setError("");

        try {
            const response = await api.post('/auth/login/', { username, password });
            const response = await api.post('auth/login/', {
                username,
                password,
            });

            dispatch(loginSuccess(response.data));

            if (response?.data?.access && response?.data?.refresh) {
            console.log(response);

            
            if (response && response.data && response.data.access && response.data.refresh && response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                dispatch(loginSuccess(response.data));

                getProfile(); // Fetch profile and navigate inside it
            handleProfileNavigation ()

            } else {
                setError("Invalid credentials. Please try again.");
                console.error('Access or Refresh token is missing:', response.data);
                setError(response.data.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.detail || "An error occurred while logging in. Please try again.");

            console.error('Login error:', error);
            setError('An error occurred while logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
                    }}
                >
                            sx={{
                            }}
                            disabled={loading}
                        >
        </ThemeProvider>
    );
}

export default Login;
