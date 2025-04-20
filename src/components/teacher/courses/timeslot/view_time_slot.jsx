import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';

const TimeSlotView = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch('/api/courses/slots/');
        const data = await response.json();
        setTimeSlots(data);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {timeSlots.map((slot, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {slot.course_name} - Section {slot.section}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Day:</strong> {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Time:</strong> {slot.start_time} - {slot.end_time}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Room Link:</strong> {slot.room_link}
              </Typography>
              <Typography variant="body2">
                <strong>Timezone:</strong> {slot.timezone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TimeSlotView;
