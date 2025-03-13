import {useState} from "react";

import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    Container,
    Box,
    Typography,
    Avatar,
    Grid,
    Button,
    TextField,
    Paper,
    Divider,
    IconButton,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ThemeProvider
} from '@mui/material';
import api from "js-cookie";
import {setUser} from "../manage-profile/manage-profile.js";

const Teacher = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.user.user);

    const teacher_api = async () => {
        api.get(`api/teacher-profiles/`)
    }

    const fetchTeacherProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('api/teacher-profiles/');
            console.log(response);
            console.log(userData);

            if (response.status === 200) {
                dispatch(setUser(response.data));
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection={{xs: 'column', sm: 'row'}}
            justifyContent="space-between"
            alignItems={{xs: 'flex-start', sm: 'center'}}
            mb={3}
            gap={2}
        >
            fetchTeacherProfile();
        </Box>
    )

}

export default Teacher;
