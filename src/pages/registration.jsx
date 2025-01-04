// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Typography, Container, Box, ThemeProvider, CircularProgress } from '@mui/material';
// import theme from '../components/Theme'; 
// import api from "../api";
// import { useNavigate, useLocation } from 'react-router-dom';

// function Register() {
//     useEffect(() => {
//         document.title = "Sign Up | AI Teaching Assistant"; 
//     }, []);

//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password1, setPassword1] = useState('');
//     const [password2, setPassword2] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [role, setRole] = useState('student'); 
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         if (location.state && location.state.role) {
//             setRole(location.state.role); 
//         }
//     }, [location.state]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         if (password1 !== password2) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }

//         try {
           
//             const response = await api.post('api/accounts/registration/', {
//                 username,
//                 email,
//                 password1: password1,
//                 password2: password2,
//                 first_name: firstName,
//                 last_name: lastName,
//                 role,
//             });

//             console.log(response);
//             console.log(response.data.message);
            
//             if (response.status==201) {
//                 navigate('verifyemail/')
//             }
            
//         } catch (error) {
            
//             console.error('Registration error:', error);
//             setError('An error occurred during registration. Please try again.');
//         } finally {
            
//             setLoading(false);
//         }
//     };

//     return (
//         <ThemeProvider theme={theme}>
//             <Container
//                 component="main"
//                 maxWidth="xs"
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '120vh',
//                 }}
//             >
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         padding: 2,
//                         boxShadow: 2,
//                         borderRadius: 1,
//                     }}
//                 >
//                     <img
//                         src='/vite.svg'
//                         alt="Logo"
//                         style={{ width: '50px', marginBottom: '50px' }}
//                     />
//                     <Typography variant="h5" gutterBottom>
//                         Sign Up
//                     </Typography>

//                     {error && (
//                         <Typography color="error" variant="body2" gutterBottom>
//                             {error}
//                         </Typography>
//                     )}

//                     <form onSubmit={handleSubmit} style={{ width: '100%' }}>

//                     <TextField
//                             label="First Name"
//                             type="text"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={firstName}
//                             onChange={(e) => setFirstName(e.target.value)}
//                             required
//                         />

//                         <TextField
//                             label="Last Name"
//                             type="text"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={lastName}
//                             onChange={(e) => setLastName(e.target.value)}
//                             required
//                         />

//                         <TextField
//                             label="Username"
//                             type="text"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />

//                         <TextField
//                             label="Email"
//                             type="email"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />

//                         <TextField
//                             label="Password"
//                             type="password"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={password1}
//                             onChange={(e) => setPassword1(e.target.value)}
//                             required
//                         />

//                         <TextField
//                             label="Confirm Password"
//                             type="password"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={password2}
//                             onChange={(e) => setPassword2(e.target.value)}
//                             required
//                         />

                      

//                         <TextField
//                             label="Role"
//                             type="text"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             required
//                             disabled // Ensure the role is fixed as "Teacher"
//                         />

//                         <Button
//                             type="submit"
//                             variant="contained"
//                             fullWidth
//                             sx={{
//                                 mt: 2,
//                                 backgroundColor: 'primary.main',
//                                 position: 'relative',
//                                 cursor: loading ? 'not-allowed' : 'pointer',
//                                 color: loading ? 'black' : 'white',
//                             }}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <>
//                                     Please Wait
//                                     <CircularProgress
//                                         size={24}
//                                         style={{ marginLeft: 3 }}
//                                     />
//                                 </>
//                             ) : (
//                                 'Sign Up'
//                             )}
//                         </Button>
//                     </form>
//                 </Box>
//             </Container>
//         </ThemeProvider>
//     );
// }

// export default Register;


import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Stepper, Step, StepLabel, CircularProgress, ThemeProvider } from '@mui/material';
import theme from '../components/Theme';
import api from "../api";
import { useNavigate, useLocation } from 'react-router-dom';

function Register() {
    useEffect(() => {
        document.title = "Sign Up | AI Teaching Assistant";
    }, []);

    const [activeStep, setActiveStep] = useState(0);  // State to track the current step
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.role) {
            setRole(location.state.role); // Set role if passed in state
        }
    }, [location.state]);

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleSubmit();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (password1 !== password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('api/accounts/registration/', {
                username,
                email,
                password1: password1,
                password2: password2,
                first_name: firstName,
                last_name: lastName,
                role,
            });

            console.log(response);
            if (response.status === 201) {
                navigate('VerifyEmail/');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Personal Information', 'Credentials', 'Role & Confirmation'];

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <TextField
                            label="Role"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            disabled
                        />
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, boxShadow: 2, borderRadius: 1 }}>
                    <img src='/vite.svg' alt="Logo" style={{ width: '50px', marginBottom: '50px' }} />
                    <Typography variant="h5" gutterBottom>Sign Up</Typography>

                    {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', marginBottom: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ width: '100%' }}>
                        {getStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="outlined" color="secondary" onClick={handleBack} disabled={activeStep === 0}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                sx={{ position: 'relative', cursor: loading ? 'not-allowed' : 'pointer', color: loading ? 'black' : 'white' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Please Wait
                                        <CircularProgress size={24} style={{ marginLeft: 3 }} />
                                    </>
                                ) : activeStep === steps.length - 1 ? 'Sign Up' : 'Next'}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Register;


