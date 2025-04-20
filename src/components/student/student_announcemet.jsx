import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
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

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.01)',
    },
}));

const TitleText = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.palette.primary.main,
}));

const DateText = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
}));

const StudentAnnouncementsPage = ({ courseId, courseWeekId }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Course ID:', courseId);
        console.log('Course Week ID:', courseWeekId);
    
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get(`/api/courses/week_announcement/`, {
                    params: { course: courseId, course_week: courseWeekId },
                });
                setAnnouncements(res.data || []);
            } catch (err) {
                console.error('Failed to fetch announcements:', err);
            } finally {
                setLoading(false);
            }
        };
    
        if (courseId && courseWeekId) {
            fetchAnnouncements();
        }
    }, [courseId, courseWeekId]);
    

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <StyledContainer maxWidth="md">
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Course Week Announcements
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {loading ? (
                <Box>
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={100} />
                </Box>
            ) : announcements.length > 0 ? (
                announcements.map((announcement) => (
                    <Box
                        component={Link}
                        to={`/announcements/${announcement.id}`}
                        key={announcement.id}
                        sx={{ textDecoration: 'none' }}
                    >
                        <StyledCard>
                            <CardContent>
                                <TitleText>{announcement.title}</TitleText>
                                <DateText>{formatDate(announcement.created_at)}</DateText>
                                <Typography
                                    variant="body1"
                                    sx={{ marginTop: 2, color: 'text.primary' }}
                                >
                                    {announcement.description}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Box>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary" textAlign="center">
                    No announcements for this course in this course week.
                </Typography>
            )}
        </StyledContainer>
    );
};

export default StudentAnnouncementsPage;
