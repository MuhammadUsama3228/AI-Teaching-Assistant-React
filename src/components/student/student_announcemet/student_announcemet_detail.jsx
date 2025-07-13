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
    useTheme,
    useMediaQuery,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import api from '../../../api.js';

const THEME_COLOR = "#4B2E83";

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(6),
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    borderLeft: `6px solid ${THEME_COLOR}`,
    backgroundColor: '#fff',
}));

const StudentAnnouncementDetailPage = () => {
    const { announcementId } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [courseWeek, setCourseWeek] = useState(null);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const res = await api.get(`/api/courses/course_weeks/`);
                const courseWeeks = res.data;

                const targetAnnouncement = courseWeeks
                    .flatMap(courseWeek =>
                        courseWeek.week_announcements.filter(a => a.id === parseInt(announcementId))
                    )[0];

                if (targetAnnouncement) {
                    setAnnouncement(targetAnnouncement);

                    const courseWeekRes = await api.get(
                        `/api/courses/course_weeks/${targetAnnouncement.course_week}`
                    );
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
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
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
            <AnnouncementCard>
                <CardContent>
                    {/* Header with icon + title + badge */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <AnnouncementIcon sx={{ fontSize: 40, color: THEME_COLOR }} />
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            fontWeight={700}
                            sx={{ color: THEME_COLOR }}
                        >
                            {announcement.title}
                        </Typography>

                        {announcement.is_official && (
                            <Chip
                                label="Official"
                                color="primary"
                                size="small"
                                sx={{
                                    ml: isMobile ? 0 : 'auto',
                                    bgcolor: THEME_COLOR,
                                    color: '#fff',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                }}
                            />
                        )}
                    </Box>

                    {/* Meta information */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {`Published on: ${formatDate(announcement.created_at)} | Announcement Date: ${formatDate(announcement.announcement_date)}`}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Announcement content */}
                    <Typography variant="body1" paragraph sx={{ color: '#333' }}>
                        {announcement.content}
                    </Typography>



                </CardContent>
            </AnnouncementCard>
        </StyledContainer>
    );
};

export default StudentAnnouncementDetailPage;
