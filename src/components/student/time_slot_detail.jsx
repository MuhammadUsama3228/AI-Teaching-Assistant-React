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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Class,
  AccountTree,
  Link as LinkIcon,
} from '@mui/icons-material';
import api from '../../api';

const TimeSlotDetail = () => {
  const { id } = useParams();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    api
        .get(`/api/courses/slots/${id}/`)
        .then((res) => {
          setSlot(res.data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
  }, [id]);

  const PRIMARY_COLOR = '#4B2E83';

  if (loading) {
    return (
        <Container sx={{ mt: 10, textAlign: 'center' }}>
          <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Fetching time slot details...
          </Typography>
        </Container>
    );
  }

  return (
      <Container maxWidth="sm" sx={{ mt: isMobile ? 4 : 6 }}>
        <Card sx={{ boxShadow: 4, borderRadius: 4, p: isMobile ? 2 : 3 }}>
          <CardContent>
            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems={isMobile ? 'flex-start' : 'center'}
                gap={2}
                mb={3}
            >
              <Avatar sx={{ bgcolor: PRIMARY_COLOR }}>
                <AccessTime />
              </Avatar>
              <Box>
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                >
                  Time Slot Detail
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Course timing and section info
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <InfoRow icon={<Class sx={{ color: PRIMARY_COLOR }} />} label="Course" value={slot.course_name} />
            <InfoRow icon={<AccountTree sx={{ color: PRIMARY_COLOR }} />} label="Section" value={slot.section} />
            <InfoRow icon={<CalendarToday sx={{ color: PRIMARY_COLOR }} />} label="Day" value={slot.day} />
            <InfoRow icon={<AccessTime sx={{ color: PRIMARY_COLOR }} />} label="Time" value={`${slot.start_time} - ${slot.end_time}`} />
            <InfoRow icon={<AccessTime sx={{ color: PRIMARY_COLOR }} />} label="Timezone" value={slot.timezone} />

            {slot.room_link && (
                <Box display="flex" alignItems="center" gap={1} mt={2} sx={{ flexWrap: 'wrap' }}>
                  <LinkIcon sx={{ color: PRIMARY_COLOR }} />
                  <Typography variant="body1">
                    <strong>Room Link: </strong>
                    <a
                        href={slot.room_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: PRIMARY_COLOR, wordBreak: 'break-word' }}
                    >
                      {slot.room_link}
                    </a>
                  </Typography>
                </Box>
            )}
          </CardContent>
        </Card>
      </Container>
  );
};

// Reusable InfoRow component
const InfoRow = ({ icon, label, value }) => (
    <Box display="flex" alignItems="center" gap={1} mb={2} sx={{ flexWrap: 'wrap' }}>
      {icon}
      <Typography variant="body1">
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
);

export default TimeSlotDetail;
