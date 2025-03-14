import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: "rgb(10, 72, 109)",  // Sea Green
            dark: "#1a237e",
           
        },
        disabled:{
            main: '#297373',
        },
        secondary: {
            main: '#FF5722',  // Custom secondary color (red)
        },
        background: {
            default: '#f4f4f4', // Custom background color
        },
        text : {
            default: '#000000',
        }

    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: "primary",
                        },
                        '&:hover fieldset': {
                            borderColor: 'hover',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'hover',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#ccc',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'primary',
                    },
                },
            },
        },
    },
});

export default theme;
