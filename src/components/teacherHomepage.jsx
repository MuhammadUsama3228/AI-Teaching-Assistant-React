import React, { useEffect, useState } from 'react';
import {
    Typography, Box, CircularProgress, Divider, Snackbar,
    Alert, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Button, Card, useTheme, useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import api from '../api';
import RecordNotFound from './Record_not_found.jsx';

export default function Teacherview() {
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.up('xl'));

    let chartHeight = 300;
    if (isXs) chartHeight = 200;
    else if (isSm) chartHeight = 250;
    else if (isMd) chartHeight = 300;
    else if (isLg) chartHeight = 350;
    else if (isXl) chartHeight = 400;

    const [loading, setLoading] = useState(true);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [courses, setCourses] = useState([]);
    const [slots, setSlots] = useState({});
    const [feedbackAverages, setFeedbackAverages] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [assignmentMarksData, setAssignmentMarksData] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [enrollRes, courseRes, slotsRes, feedbackRes, submissionRes] = await Promise.all([
                    api.get('/api/courses/enrollment/'),
                    api.get('/api/courses/course/'),
                    api.get('/api/courses/slots/'),
                    api.get('/api/courses/feedback/'),
                    api.get('/api/courses/submission/')
                ]);

                setEnrollmentCount(Array.isArray(enrollRes.data) ? enrollRes.data.length : 0);
                setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);

                const slotsData = {};
                slotsRes.data.forEach((slot) => {
                    if (!slotsData[slot.course]) slotsData[slot.course] = [];
                    slotsData[slot.course].push(slot);
                });
                setSlots(slotsData);

                const feedbackByCourse = {};
                feedbackRes.data.forEach((item) => {
                    const courseId = item.course;
                    const rating = parseFloat(item.rating);
                    if (!feedbackByCourse[courseId]) feedbackByCourse[courseId] = [];
                    if (!isNaN(rating)) feedbackByCourse[courseId].push(rating);
                });

                const feedbackSummary = Object.entries(feedbackByCourse).map(([courseId, ratings]) => {
                    const courseTitle = courseRes.data.find(c => c.id === parseInt(courseId))?.course_title || 'Unknown';
                    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                    const max = Math.max(...ratings);
                    const min = Math.min(...ratings);
                    return {
                        name: courseTitle,
                        avgRating: parseFloat(avg.toFixed(2)),
                        maxRating: parseFloat(max.toFixed(2)),
                        minRating: parseFloat(min.toFixed(2))
                    };
                });

                setFeedbackAverages(feedbackSummary);
                setPerformanceData(feedbackSummary.map(item => ({ name: item.name, performance: item.avgRating })));

                const marksData = submissionRes.data
                    .filter(sub => sub.obtained_marks !== null)
                    .map(sub => ({ name: sub.assignment_title, marks: sub.obtained_marks }));
                setAssignmentMarksData(marksData);
            } catch {
                setError('Failed to load data. Please try again later.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSnackbarClose = () => setOpenSnackbar(false);

    const formatTime = (date) => date.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const formatDate = (date) => date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography mt={2}>Loading Dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
                Teacher Dashboard
            </Typography>

            {/* Summary Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
                {[{ title: 'Students Enrolled', value: enrollmentCount }, { title: 'Calendar', value: 'Upcoming Activities' }, { title: 'Total Courses', value: courses.length }].map((card, i) => (
                    <Card key={i} sx={{ flex: "1 1 250px", p: 3, borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper' }}>
                        <Typography variant="subtitle1" color="primary">{card.title}</Typography>
                        <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
                    </Card>
                ))}
            </Box>

            {/* Feedback Ratings & Performance */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ flex: "1 1 400px", minWidth: "300px" }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Feedback Ratings</Typography>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                        {feedbackAverages.length === 0 ? <RecordNotFound /> : (
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <BarChart data={feedbackAverages}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="minRating" fill={theme.palette.error.main} name="Min" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="avgRating" fill={theme.palette.primary.main} name="Avg" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="maxRating" fill={theme.palette.success.main} name="Max" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Box>

                <Box sx={{ flex: "1 1 400px", minWidth: "300px" }}>
                    <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Student Performance</Typography>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                        {performanceData.length === 0 ? <RecordNotFound /> : (
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <LineChart data={performanceData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="performance" stroke={theme.palette.primary.main} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Box>
            </Box>

            {/* Assignment Marks */}
            <Typography variant="h6" fontWeight="bold" mt={5} mb={2} color="primary">Assignment Marks</Typography>
            <Card sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: 3 }}>
                {assignmentMarksData.length === 0 ? <RecordNotFound /> : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart data={assignmentMarksData}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="marks" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Card>

            {/* Current Time */}
            <Divider sx={{ my: 5 }} />
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Current Time</Typography>
            <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="body1">{formatDate(currentTime)}</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {formatTime(currentTime)}
                </Typography>
            </Card>

            {/* Your Courses */}
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Your Courses</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {courses.map((course) => (
                    <Box key={course.id} sx={{ flex: '1 1 300px', minWidth: '260px' }}>
                        <Link to={`/coursedetail/${course.id}`} style={{ textDecoration: 'none' }}>
                            <Card
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': { boxShadow: 6, transform: 'scale(1.02)' }
                                }}
                            >
                                <Typography variant="h6" fontWeight={600}>
                                    {course.course_title}
                                </Typography>
                            </Card>
                        </Link>
                    </Box>
                ))}
            </Box>

            {/* Course Time Slots */}
            <Divider sx={{ my: 5 }} />
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Course Time Slots</Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {["Course", "Section", "Day", "Start Time", "End Time", "Room Link"].map((header) => (
                                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(slots).flatMap((courseId) =>
                                slots[courseId].map((slot) => (
                                    <TableRow key={slot.id} hover>
                                        <TableCell>{slot.course_name}</TableCell>
                                        <TableCell>{slot.section}</TableCell>
                                        <TableCell>{slot.day}</TableCell>
                                        <TableCell>{slot.start_time}</TableCell>
                                        <TableCell>{slot.end_time}</TableCell>
                                        <TableCell>
                                            {slot.room_link && slot.room_link !== 'N/A' ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    href={slot.room_link}
                                                    target="_blank"
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Join Room
                                                </Button>
                                            ) : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Error Snackbar */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
