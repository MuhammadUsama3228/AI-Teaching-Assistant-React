import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Snackbar,
  Alert,
 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import api from '../../api';
import { Tabs, Tab } from '@mui/material';

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [file, setFile] = useState(null);

  const steps = ['Enter Submission', 'Review & Submit'];

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/courses/submission/?assignment=${assignmentId}`);
        const foundSubmission = response.data.length > 0 ? response.data[0] : null;
        setSubmission(foundSubmission);
        setSubmissionTitle(foundSubmission?.assignment_title || '');
      } catch (err) {
        setError('Failed to load submission');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) fetchSubmission();
  }, [assignmentId]);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmitClick = () => setOpenDialog(true);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setActiveStep(0);
    setSubmissionTitle('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleNext = async () => {
    if (!submissionTitle && !file) {
      setError('Please provide a submission title or upload a file.');
      setOpenSnackbar(true);
      return;
    }

    if (activeStep === steps.length - 1) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('assignment', assignmentId);
        formData.append('assignment_title', submissionTitle);
        if (file) formData.append('file', file);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        if (submission?.id) {
          await api.patch(`/api/courses/submission/${submission.id}/`, formData, config);
        } else {
          await api.post(`/api/courses/submission/`, formData, config);
        }

        setError(null);
        setOpenSnackbar(true);
        handleDialogClose();

        const response = await api.get(`/api/courses/submission/?assignment=${assignmentId}`);
        setSubmission(response.data.length > 0 ? response.data[0] : null);
      } catch (err) {
        setError('Failed to submit assignment.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const getStatusAlert = () => {
    if (!submission) return null;

    if (submission.obtained_marks !== null && submission.feedback) {
      return (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 2 }}>
          Feedback provided and assignment marked.
        </Alert>
      );
    } else if (submission.obtained_marks === null && submission.feedback) {
      return (
        <Alert icon={<HourglassEmptyIcon />} severity="info" sx={{ mb: 2 }}>
          Feedback given but marks are pending.
        </Alert>
      );
    } else {
      return (
        <Alert icon={<WarningIcon />} severity="warning" sx={{ mb: 2 }}>
          Awaiting evaluation and feedback.
        </Alert>
      );
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 3, p: isSmallScreen ? 2 : 4, backgroundColor: '#fff' }}>
          <Box display="flex" alignItems="center" mb={3} flexDirection={isSmallScreen ? 'column' : 'row'}>
            <Avatar sx={{ bgcolor: '#003366', width: 60, height: 60, mr: isSmallScreen ? 0 : 2, mb: isSmallScreen ? 1 : 0 }}>
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box textAlign={isSmallScreen ? 'center' : 'left'}>
              <Typography variant="h5" fontWeight="bold" color="#003366">
                Assignment Submission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and update your assignment submission below.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <>
              <Skeleton height={40} />
              <Skeleton height={20} />
              <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            </>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {submission && getStatusAlert()}

              {submission ? (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e9f1fb' }}>

                    <Typography variant="h6">Submission Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>

                    <Typography gutterBottom><strong>Assignmet Title:</strong> {submission.assignment_title}</Typography>

                    <Typography gutterBottom><strong>Submitted On:</strong> {new Date(submission.submission_date).toLocaleString()}</Typography>
                    <Typography gutterBottom><strong>Attempts Used:</strong> {submission.obtained_attempts}</Typography>
                    <Typography gutterBottom><strong>Marks Obtained:</strong> {submission.obtained_marks ?? 'Pending'}</Typography>
                    <Typography gutterBottom><strong>Feedback:</strong> {submission.feedback ?? 'Not yet provided'}</Typography>
                    {submission.file && (
                      <Typography>
                        <strong>File:</strong>{' '}
                        <a href={submission.file} target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Typography align="center">No submission found for this assignment.</Typography>
              )}

              <Box mt={4} textAlign="center">
                <Button variant="contained" onClick={handleSubmitClick} size="large" sx={{ bgcolor: '#003366' }}>
                  {submission ? 'Update Submission' : 'Upload Submission'}
                </Button>
              </Box>
            </>
          )}

          {/* Submission Dialog */}
         <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#003366' }}>
          {submission ? 'Update Submission' : 'New Submission'}
        </DialogTitle>

  <DialogContent dividers>
    <Tabs
      value={activeStep}
      onChange={(e, newValue) => setActiveStep(newValue)}
      variant="fullWidth"
      sx={{
        mb: 2,
        backgroundColor: '#f4f6f8',
        borderRadius: 2,
        '& .MuiTab-root': {
          fontWeight: 'bold',
          fontSize: '0.95rem',
        },
        '& .Mui-selected': {
          color: '#003366',
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#003366',
        },
      }}
    >
      <Tab label="Enter Submission" />
      <Tab label="Review & Submit" />
    </Tabs>

    {activeStep === 0 && (
      <Box mt={1}>
        <TextField
          fullWidth
          label="Submission Title"
          variant="outlined"
          value={submissionTitle}
          onChange={(e) => setSubmissionTitle(e.target.value)}
          margin="normal"
        />

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Upload File:
        </Typography>
        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
          Choose File
          <input
            type="file"
            hidden
            accept="*"
            onChange={handleFileChange}
          />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected File: <strong>{file.name}</strong>
          </Typography>
        )}
      </Box>
    )}

    {activeStep === 1 && (
      <Box mt={1}>
        <Typography variant="body1" gutterBottom>
          <strong>Title:</strong> {submissionTitle || 'N/A'}
        </Typography>
        {file ? (
          <Typography variant="body2" mt={2}>
            <strong>File:</strong> {file.name}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No file uploaded.
          </Typography>
        )}
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    {activeStep > 0 && (
      <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>
    )}
    {activeStep < 1 ? (
      <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)} sx={{ bgcolor: '#003366' }}>
        Next
      </Button>
    ) : (
      <Button variant="contained" onClick={handleNext} sx={{ bgcolor: '#003366' }}>
        {submission ? 'Update' : 'Submit'}
      </Button>
    )}
  </DialogActions>
</Dialog>



          <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
            <Alert severity={error ? 'error' : 'success'} onClose={handleSnackbarClose}>
              {error || 'Submission updated successfully.'}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentAssignmentDetailPage;
