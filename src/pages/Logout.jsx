import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logoutSuccess } from '../pages/auth';
import api from '../api';
import { persistor } from '../app/store';
import { Button, CircularProgress, Typography, Box, ThemeProvider } from '@mui/material';
import theme from "../components/Theme.jsx";
import { clearUser } from "./profile/manage-profile/manage-profile.js";

function Logout() {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const refreshToken = auth.refreshToken || localStorage.getItem('REFRESH_TOKEN');

                if (!refreshToken) {

                    dispatch(logoutSuccess());
                    dispatch(clearUser());
                    await persistor.purge();
                    localStorage.clear();
                    return;
                }

                await api.post('auth/logout/', { refresh: refreshToken });
                dispatch(logoutSuccess());
                dispatch(clearUser());
                await persistor.purge();
                localStorage.clear();

            } catch (error) {
                console.error('Logout error:', error);
                dispatch(logoutSuccess());
                dispatch(clearUser());
                await persistor.purge();
                localStorage.clear();
            }
        };

        handleLogout();
    }, []);

    if (!auth.refreshToken) {
        return <Navigate to="/login" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    maxWidth="400px"
                    p={3}
                    bgcolor="background.paper"
                    boxShadow={3}
                >
                    <Typography variant="h5" gutterBottom>Logging Out</Typography>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress />
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Please wait...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Logout;
