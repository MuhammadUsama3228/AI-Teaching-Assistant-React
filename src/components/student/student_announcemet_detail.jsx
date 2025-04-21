import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Divider,
    Skeleton,
    Card,
    CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Announcement as AnnouncementIcon } from '@mui/icons-material'; // Import your desired icon
import api from '../../api';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
}));

const StudentAnnouncementDetailPage = () => {
    const { announcementId } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [courseWeek, setCourseWeek] = useState(null); // To store course week details
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const res = await api.get(`/api/courses/course_weeks/`);
                const courseWeeks = res.data;

                // Find the course week that contains the announcement with the matching id
                const targetAnnouncement = courseWeeks.flatMap(courseWeek => 
                    courseWeek.week_announcements.filter(announcement => announcement.id === parseInt(announcementId))
                )[0];

                if (targetAnnouncement) {
                    setAnnouncement(targetAnnouncement);

                    // Now fetch the course week data for the course containing this announcement
                    const courseWeekRes = await api.get(`/api/courses/course_weeks/${targetAnnouncement.course_week}`);
                    setCourseWeek(courseWeekRes.data);
                } else {
                    console.error('Announcement not found');
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
            {/* Announcement Card */}
            <AnnouncementCard>
                <CardContent>
                    {/* Box with icon on the left */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AnnouncementIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h5" component="div" gutterBottom>
                            {announcement.title}
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        {`Published on: ${formatDate(announcement.created_at)} | Announcement Date: ${formatDate(announcement.announcement_date)}`}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" paragraph>
                        {announcement.content}
                    </Typography>
                </CardContent>
            </AnnouncementCard>
        </StyledContainer>
    );
};

export default StudentAnnouncementDetailPage;
