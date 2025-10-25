import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4B2E83', // UMT-style royal purple
            contrastText: '#fff',
        },
        secondary: {
            main: '#FF7043',
            contrastText: '#fff',
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#555555',
            disabled: '#f8f6f6',
        },
        divider: '#e0e0e0',
    },

    typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },

    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        '& fieldset': {
                            borderColor: '#ccc',
                        },
                        '&:hover fieldset': {
                            borderColor: '#4B2E83',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FF7043',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#666',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#FF7043',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #311B92 0%, #1A237E 100%)',
                    color: '#fff',
                    boxShadow: '0px 4px 12px rgba(50, 50, 93, 0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1A237E 0%, #0D1333 100%)',
                        boxShadow: '0px 6px 14px rgba(50, 50, 93, 0.35)',
                    },
                    '&:disabled': {
                        backgroundColor: '#ccc',
                        color: '#888',
                        boxShadow: 'none',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'cancel' },
                    style: {
                        backgroundColor: '#f44336',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#d32f2f' },
                    },
                },
                {
                    props: { variant: 'save' },
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#388e3c' },
                    },
                },
                {
                    props: { variant: 'update' },
                    style: {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#1565c0' },
                    },
                },
                {
                    props: { variant: 'edit' },
                    style: {
                        backgroundColor: '#ff9800',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#fb8c00' },
                    },
                },
            ],
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
