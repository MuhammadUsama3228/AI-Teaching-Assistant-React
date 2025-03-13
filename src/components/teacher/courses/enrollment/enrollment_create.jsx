import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

const EnrollmentPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("access_token"); // Get token from local storage
                if (!token) {
                    setError("Unauthorized. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://127.0.0.1:8000/api/student/courses/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCourses(response.data);
            } catch (err) {
                setError("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                My Courses
            </Typography>
            {courses.length === 0 ? (
                <Typography>No courses enrolled.</Typography>
            ) : (
                <List>
                    {courses.map((enrollment) => (
                        <ListItem key={enrollment.id}>
                            <ListItemText
                                primary={enrollment.course.name}
                                secondary={enrollment.course.description}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default EnrollmentPage;
