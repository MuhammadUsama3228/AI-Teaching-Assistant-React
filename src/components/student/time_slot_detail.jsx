import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import { AccessTime, CalendarToday, Class, AccountTree, Link } from '@mui/icons-material';
import api from '../../api';

const TimeSlotDetail = () => {
  const { id } = useParams();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/courses/slots/${id}/`)
      .then((res) => {
        setSlot(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Fetching time slot details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 4, p: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <AccessTime />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Time Slot Detail
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Course timing and section info
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Class sx={{ color: '#1976d2' }} />
            <Typography variant="body1">
              <strong>Course:</strong> {slot.course_name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccountTree sx={{ color: '#1976d2' }} />
            <Typography variant="body1">
              <strong>Section:</strong> {slot.section}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CalendarToday sx={{ color: '#1976d2' }} />
            <Typography variant="body1">
              <strong>Day:</strong> {slot.day}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccessTime sx={{ color: '#1976d2' }} />
            <Typography variant="body1">
              <strong>Time:</strong> {slot.start_time} - {slot.end_time}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccessTime sx={{ color: '#1976d2' }} />
            <Typography variant="body1">
              <strong>Timezone:</strong> {slot.timezone}
            </Typography>
          </Box>

          {slot.room_link && (
            <Box display="flex" alignItems="center" gap={1}>
              <Link sx={{ color: '#1976d2' }} />
              <Typography variant="body1">
                <strong>Room Link:</strong> <a href={slot.room_link} target="_blank" rel="noopener noreferrer">{slot.room_link}</a>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TimeSlotDetail;
