import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Box, Typography } from '@mui/material';

const RecordNotFound = ({ message = 'No Data Found' }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="70vh"
        >
            <Box
                sx={{
                    width: '400px', // ✅ Bigger size
                    maxWidth: '90vw',

                }}
            >
                <DotLottieReact
                    src="https://lottie.host/c99b937b-6343-41c3-aa40-360ad756fad6/Ta1sZzddDX.lottie"
                    loop
                    autoplay
                />
            </Box>
            <Typography variant="h5" color="text.secondary" mt={3}>
                {message}
            </Typography>
        </Box>
    );
};

export default RecordNotFound;
