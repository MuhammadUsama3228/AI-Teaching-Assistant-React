import React, { useState, useEffect } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
  Box,
  Typography,
  Slider,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

import api from '../../../../api'; // your API utils

// Setup date-fns localizer
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const dayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const reverseDayMap = Object.entries(dayMap).reduce((acc, [k, v]) => {
  acc[v] = k.charAt(0).toUpperCase() + k.slice(1);
  return acc;
}, {});

const mapSlotsToEvents = (slots) => {
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const currentDay = baseDate.getDay();
  baseDate.setDate(baseDate.getDate() - currentDay); // back to Sunday

  return slots.map((slot, index) => {
    const dayNumber = dayMap[slot.day.toLowerCase()] ?? 0;
    const [startHour, startMinute] = slot.start_time.split(':').map(Number);
    const [endHour, endMinute] = slot.end_time.split(':').map(Number);

    const start = new Date(baseDate);
    start.setDate(baseDate.getDate() + dayNumber);
    start.setHours(startHour, startMinute);

    const end = new Date(baseDate);
    end.setDate(baseDate.getDate() + dayNumber);
    end.setHours(endHour, endMinute);

    return {
      id: index,
      title: `${slot.course_name} (${slot.section})`,
      start,
      end,
      allDay: false,
      room_link: slot.room_link,
      timezone: slot.timezone,
      originalSlot: slot, // keep original for update/delete
    };
  });
};

const convertSlotsToCSV = (slots) => {
  const header = [
    'Course Name',
    'Section',
    'Day',
    'Start Time',
    'End Time',
    'Room Link',
    'Timezone',
  ];
  const rows = slots.map((slot) => [
    slot.course_name,
    slot.section,
    slot.day,
    slot.start_time,
    slot.end_time,
    slot.room_link || '',
    slot.timezone || '',
  ]);
  return [header, ...rows]
    .map((e) => e.map((v) => `"${v}"`).join(','))
    .join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.click();

  URL.revokeObjectURL(url);
};

const TimeSlotCalendar = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseIndex, setCourseIndex] = useState(-1);
  const [courses, setCourses] = useState([]);

  // For slot dialogs
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    course_name: '',
    section: '',
    day: '',
    start_time: '',
    end_time: '',
    room_link: '',
    timezone: '',
  });

  // Snackbar for messages
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get('/api/courses/slots/');
        const data = response.data;
        setTimeSlots(data);

        const uniqueCourses = Array.from(
          new Set(data.map((slot) => slot.course_name))
        ).sort();
        setCourses(uniqueCourses);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleSliderChange = (event, newValue) => {
    setCourseIndex(newValue);
  };

  const filteredTimeSlots =
    courseIndex === -1
      ? timeSlots
      : timeSlots.filter((slot) => slot.course_name === courses[courseIndex]);

  const events = mapSlotsToEvents(filteredTimeSlots);

  // Click on calendar event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    // Pre-fill update form with original slot data
    setUpdateForm({ ...event.originalSlot });
    setOpenActionDialog(true);
  };

  // Close all dialogs
  const handleCloseDialogs = () => {
    setOpenActionDialog(false);
    setOpenUpdateDialog(false);
    setOpenDeleteConfirm(false);
    setSelectedEvent(null);
  };

  // Handle form changes
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Update slot API call
  const handleUpdateSlot = async () => {
    if (!selectedEvent) return;

    // Simple verification message
    if (!window.confirm('Are you sure you want to update this time slot?')) return;

    try {
      // Example API call - replace URL and payload with your real backend
      await api.put(`/api/courses/slots/${selectedEvent.originalSlot.id}/`, updateForm);

      // Update local state
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === selectedEvent.originalSlot.id ? { ...updateForm, id: slot.id } : slot
        )
      );
      setSnackbar({ open: true, message: 'Time slot updated successfully.', severity: 'success' });
      handleCloseDialogs();
    } catch (error) {
      console.error('Update failed:', error);
      setSnackbar({ open: true, message: 'Failed to update time slot.', severity: 'error' });
    }
  };

  // Delete slot API call
  const handleDeleteSlot = async () => {
    if (!selectedEvent) return;

    if (!window.confirm('Are you sure you want to delete this time slot?')) return;

    try {
      // Replace with your real API endpoint
      await api.delete(`/api/courses/slots/${selectedEvent.originalSlot.id}/`);

      setTimeSlots((prev) =>
        prev.filter((slot) => slot.id !== selectedEvent.originalSlot.id)
      );
      setSnackbar({ open: true, message: 'Time slot deleted.', severity: 'success' });
      handleCloseDialogs();
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({ open: true, message: 'Failed to delete time slot.', severity: 'error' });
    }
  };

  const currentCourseLabel =
    courseIndex === -1 ? 'All Courses' : courses[courseIndex];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#084475FF' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Time Slots Scheduler
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              const csv = convertSlotsToCSV(filteredTimeSlots);
              downloadCSV(csv, 'time_slots.csv');
            }}
          >
            Download CSV
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: '#084475FF', fontWeight: 'bold' }}
        >
          Time Slots Calendar
        </Typography>

        <Typography gutterBottom>
          Select Course: <strong>{currentCourseLabel}</strong>
        </Typography>
        <Slider
          value={courseIndex}
          min={-1}
          max={courses.length - 1}
          step={1}
          marks={[
            { value: -1, label: 'All' },
            ...courses.map((course, i) => ({ value: i, label: course })),
          ]}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          sx={{ width: 400, mb: 3 }}
        />

        <Calendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.WEEK, Views.DAY]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#084475FF',
              color: '#fff',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            },
          })}
          tooltipAccessor={(event) =>
            `Room: ${event.room_link || 'N/A'} | Timezone: ${event.timezone}`
          }
        />
      </Box>

      {/* Action Dialog: Update or Delete */}
      <Dialog open={openActionDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Manage Time Slot</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedEvent
              ? `Course: ${selectedEvent.title}`
              : ''}
          </Typography>
          <Typography>
            {selectedEvent
              ? `Day: ${selectedEvent.originalSlot.day}, ${selectedEvent.originalSlot.start_time} - ${selectedEvent.originalSlot.end_time}`
              : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenActionDialog(false);
              setOpenUpdateDialog(true);
            }}
          >
            Update
          </Button>
          <Button
            color="error"
            onClick={() => {
              setOpenActionDialog(false);
              setOpenDeleteConfirm(true);
            }}
          >
            Delete
          </Button>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Update Time Slot</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Course Name"
            name="course_name"
            fullWidth
            value={updateForm.course_name}
            onChange={handleUpdateFormChange}
          />
          <TextField
            margin="normal"
            label="Section"
            name="section"
            fullWidth
            value={updateForm.section}
            onChange={handleUpdateFormChange}
          />
          <TextField
            margin="normal"
            label="Day"
            name="day"
            select
            fullWidth
            value={updateForm.day}
            onChange={handleUpdateFormChange}
          >
            {Object.keys(dayMap).map((day) => (
              <MenuItem key={day} value={day.charAt(0).toUpperCase() + day.slice(1)}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Start Time"
            name="start_time"
            type="time"
            fullWidth
            value={updateForm.start_time}
            onChange={handleUpdateFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            label="End Time"
            name="end_time"
            type="time"
            fullWidth
            value={updateForm.end_time}
            onChange={handleUpdateFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            label="Room Link"
            name="room_link"
            fullWidth
            value={updateForm.room_link || ''}
            onChange={handleUpdateFormChange}
          />
          <TextField
            margin="normal"
            label="Timezone"
            name="timezone"
            fullWidth
            value={updateForm.timezone || ''}
            onChange={handleUpdateFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateSlot} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDialogs}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the time slot for{' '}
            <strong>{selectedEvent?.title}</strong> on{' '}
            <strong>{selectedEvent?.originalSlot.day}</strong> from{' '}
            <strong>{selectedEvent?.originalSlot.start_time}</strong> to{' '}
            <strong>{selectedEvent?.originalSlot.end_time}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSlot} color="error" variant="contained">
            Delete
          </Button>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimeSlotCalendar;
