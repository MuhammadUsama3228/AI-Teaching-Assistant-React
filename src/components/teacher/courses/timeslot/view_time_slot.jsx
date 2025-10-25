import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Box, Slider, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Snackbar, Alert, Paper, Divider, IconButton, CircularProgress, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../../../api';
import Record_not_found from "../../../Record_not_found.jsx";
import theme from "../../../Theme.jsx";  // Your custom theme

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const dayMap = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6
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

const mapSlotsToEvents = (slots) => {
  return slots.map((slot, idx) => {
    const dayNum = dayMap[slot.day.toLowerCase()];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() - getDay(base));

    const start = new Date(base);
    start.setDate(start.getDate() + dayNum);
    const [sh, sm] = slot.start_time.split(':').map(Number);
    start.setHours(sh, sm);

    const end = new Date(base);
    end.setDate(end.getDate() + dayNum);
    const [eh, em] = slot.end_time.split(':').map(Number);
    end.setHours(eh, em);

    return {
      id: `slot-${idx}`,
      title: slot.course_name,
      start,
      end,
      originalSlot: slot,
      room_link: slot.room_link,
      timezone: slot.timezone
    };
  });
};

const convertSlotsToCSV = (slots) => {
  const headers = Object.keys(slots[0] || {});
  const rows = slots.map(slot => headers.map(h => slot[h]).join(','));
  return [headers.join(','), ...rows].join('\n');
};

const TimeSlotCalendar = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseIndex, setCourseIndex] = useState(-1);
  const [courses, setCourses] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);


  const [updateForm, setUpdateForm] = useState({
    course_name: '', section: '', day: '', start_time: '', end_time: '', room_link: '', timezone: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const muiTheme = useTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get('/api/courses/slots/');
        const data = response.data;

        if (Array.isArray(data)) {
          setTimeSlots(data);
          const uniqueCourses = [...new Set(data.map(slot => slot.course_name))].sort();
          setCourses(uniqueCourses);
        } else {
          // Defensive check if API returns non-array data
          console.error('Unexpected API response (not an array):', data);
          setTimeSlots([]);
          setCourses([]);
          setError('Unexpected response from server.');
        }

      } catch (error) {
        setError('Failed to load time slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);



  const handleSliderChange = (_, newValue) => setCourseIndex(newValue);
  const filteredTimeSlots = courseIndex === -1 ? timeSlots : timeSlots.filter(s => s.course_name === courses[courseIndex]);
  const events = mapSlotsToEvents(filteredTimeSlots);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setUpdateForm({ ...event.originalSlot });
    setOpenActionDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenActionDialog(false);
    setOpenUpdateDialog(false);
    setOpenDeleteConfirm(false);
    setSelectedEvent(null);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSlot = async () => {
    if (!selectedEvent) return;
    try {
      await api.put(`/api/courses/slots/${selectedEvent.originalSlot.id}/`, updateForm);
      setTimeSlots(prev => prev.map(slot => slot.id === selectedEvent.originalSlot.id ? { ...updateForm, id: slot.id } : slot));
      setSnackbar({ open: true, message: 'Time slot updated.', severity: 'success' });
      handleCloseDialogs();
    } catch (error) {
      console.error('Update failed:', error);
      setSnackbar({ open: true, message: 'Failed to update.', severity: 'error' });
    }
  };

  const handleDeleteSlot = async () => {
    if (!selectedEvent) return;
    try {
      await api.delete(`/api/courses/slots/${selectedEvent.originalSlot.id}/`);
      setTimeSlots(prev => prev.filter(slot => slot.id !== selectedEvent.originalSlot.id));
      setSnackbar({ open: true, message: 'Time slot deleted.', severity: 'success' });
      handleCloseDialogs();
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({ open: true, message: 'Failed to delete.', severity: 'error' });
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  const currentCourseLabel = courseIndex === -1 ? 'All Courses' : courses[courseIndex];

  return (
      <Box>
        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', height: '100%' }}>
          {/* Left Sidebar */}
          <Box sx={{
            width: isSmallScreen ? '100%' : 350,
            p: 2,
            bgcolor: '#fff',
            borderRight: isSmallScreen ? 'none' : '1px solid #ddd',
            borderBottom: isSmallScreen ? '1px solid #ddd' : 'none',
            overflowY: 'auto',
            maxHeight: isSmallScreen ? '400px' : '100vh',
            boxShadow: isSmallScreen ? 'none' : '4px 0 10px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Event List</Typography>
            <Divider sx={{ mb: 2 }} />
            {events.length === 0 ? <Record_not_found /> : (
                events.sort((a, b) => a.start - b.start).map(event => (
                    <Paper key={event.id} sx={{
                      p: 2, mb: 2, borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }
                    }}>
                      <Box display="flex" alignItems="center">
                        <Box>
                          <Typography variant="caption" color="text.secondary">{format(event.start, 'MMM d, yyyy')}</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(event.start, 'hh:mm a')} – {format(event.end, 'hh:mm a')}
                          </Typography>
                        </Box>
                        <IconButton onClick={() => handleSelectEvent(event)} sx={{ ml: 'auto', color: 'primary.main' }}>
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                ))
            )}
          </Box>

          {/* Calendar */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h5" sx={{
              mb: 3, color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', alignItems: 'center'
            }}>
              Time Slots Calendar
              <IconButton
                  onClick={() => downloadCSV(convertSlotsToCSV(filteredTimeSlots), 'time_slots.csv')}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    ml: 2,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
              >
                <DownloadIcon />
              </IconButton>
            </Typography>

            <Typography gutterBottom>
              Select Course: <strong>{currentCourseLabel}</strong>
            </Typography>
            <Slider
                value={courseIndex}
                min={-1}
                max={courses.length - 1}
                step={1}
                marks={[{ value: -1, label: 'All' }, ...courses.map((c, i) => ({ value: i, label: c }))]}
                onChange={handleSliderChange}
                sx={{ width: isSmallScreen ? '100%' : 400, mb: 3 }}
            />
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.WEEK}
                views={[Views.WEEK, Views.DAY]}
                startAccessor="start"
                endAccessor="end"
                style={{ height: isSmallScreen ? '60vh' : 'calc(100vh - 200px)' }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={() => ({
                  style: { backgroundColor: theme.palette.primary.main, color: '#fff', borderRadius: '5px', cursor: 'pointer' }
                })}
                tooltipAccessor={(event) => `Room: ${event.room_link || 'N/A'} | Timezone: ${event.timezone}`}
            />
          </Box>
        </Box>

        {/* Dialogs */}
        {/* Action Dialog */}
        <Dialog open={openActionDialog} onClose={handleCloseDialogs}>
          <DialogTitle>Manage Time Slot</DialogTitle>
          <DialogContent>
            <Typography>Course: {selectedEvent?.title}</Typography>
            <Typography>Day: {selectedEvent?.originalSlot.day}, {selectedEvent?.originalSlot.start_time} - {selectedEvent?.originalSlot.end_time}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenActionDialog(false); setOpenUpdateDialog(true); }}>Update</Button>
            <Button color="error" onClick={() => { setOpenActionDialog(false); setOpenDeleteConfirm(true); }}>Delete</Button>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Update Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Update Time Slot</DialogTitle>
          <DialogContent dividers>
            <TextField margin="normal" label="Course Name" name="course_name" fullWidth value={updateForm.course_name} onChange={handleUpdateFormChange} />
            <TextField margin="normal" label="Section" name="section" fullWidth value={updateForm.section} onChange={handleUpdateFormChange} />
            <TextField margin="normal" label="Day" name="day" select fullWidth value={updateForm.day} onChange={handleUpdateFormChange}>
              {Object.keys(dayMap).map(day => (
                  <MenuItem key={day} value={day.charAt(0).toUpperCase() + day.slice(1)}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </MenuItem>
              ))}
            </TextField>
            <TextField margin="normal" label="Start Time" name="start_time" type="time" fullWidth value={updateForm.start_time} onChange={handleUpdateFormChange} InputLabelProps={{ shrink: true }} />
            <TextField margin="normal" label="End Time" name="end_time" type="time" fullWidth value={updateForm.end_time} onChange={handleUpdateFormChange} InputLabelProps={{ shrink: true }} />
            <TextField margin="normal" label="Room Link" name="room_link" fullWidth value={updateForm.room_link || ''} onChange={handleUpdateFormChange} />
            <TextField margin="normal" label="Timezone" name="timezone" fullWidth value={updateForm.timezone || ''} onChange={handleUpdateFormChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateSlot} variant="contained" color="primary">Save</Button>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDeleteConfirm} onClose={handleCloseDialogs}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the time slot for <strong>{selectedEvent?.title}</strong> on <strong>{selectedEvent?.originalSlot.day}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteSlot} color="error" variant="contained">Delete</Button>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default TimeSlotCalendar;
