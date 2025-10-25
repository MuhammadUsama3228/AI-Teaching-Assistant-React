import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const SnackbarMessage = ({ message, type, open, handleClose }) => {

    // Map the severity type to the corresponding icon
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (message) {
            handleClose(true); // Open the snackbar when the message is provided
        }
    }, [message, handleClose]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000} // Auto hide after 6 seconds
            onClose={() => handleClose(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={() => handleClose(false)}
                severity={type} // Set the severity based on the passed type
                sx={{ width: '100%' }}
                icon={getIcon()} // Set the appropriate icon based on severity
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarMessage;
