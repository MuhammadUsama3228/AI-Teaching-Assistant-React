import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Divider,
    Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../api';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
}));

const StudentAnnouncementDetailPage = () => {
    const { announcementId } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [courseWeek, setCourseWeek] = useState(null); // To store course week details
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const res = await api.get(`/api/courses/week_announcement/${announcementId}/`);
                setAnnouncement(res.data);

                // Now fetch the course week data using the course week ID from the announcement
                if (res.data.course_week) {
                    const courseWeekRes = await api.get(`/api/courses/course_weeks/${res.data.course_week}`);
                    setCourseWeek(courseWeekRes.data);
                }
            } catch (err) {
                console.error('Failed to fetch announcement:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [announcementId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <StyledContainer maxWidth="md">
                <Skeleton variant="text" height={60} width="70%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={40} width="40%" />
                <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />
            </StyledContainer>
        );
    }

    if (!announcement) {
        return (
            <StyledContainer maxWidth="md">
                <Typography variant="h6" color="textSecondary" textAlign="center">
                    Announcement not found.
                </Typography>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer maxWidth="md">
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {announcement.title}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {`Published on: ${formatDate(announcement.created_at)} | Announcement Date: ${formatDate(announcement.announcement_date)}`}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ mb: 3 }}>
                {announcement.content}
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                    Course Week: {courseWeek ? courseWeek.name : 'N/A'}
                </Typography>
            </Box>
        </StyledContainer>
    );
};

export default StudentAnnouncementDetailPage;
