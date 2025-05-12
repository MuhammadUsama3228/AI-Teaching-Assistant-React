import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../api';

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [file, setFile] = useState(null);

  const steps = ['Enter Submission', 'Review & Submit'];

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await api.get(`/api/courses/student_insight/`);
        const assignments = response.data.assignment;
        const submissions = response.data.assignment_submission;
        const foundAssignment = assignments.find(a => a.id === parseInt(assignmentId));

        if (!foundAssignment) throw new Error('Assignment not found');
        setAssignment(foundAssignment);

        const foundSubmission = submissions.find(s => s.assignment === parseInt(assignmentId));
        setSubmission(foundSubmission || null);
      } catch (err) {
        setError('Failed to load assignment');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) fetchAssignment();
  }, [assignmentId]);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmitClick = () => {
    setSubmissionTitle(submission?.assignment_title || '');
    setSubmissionText(submission?.text || '');
    setFile(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setActiveStep(0);
    setSubmissionTitle('');
    setSubmissionText('');
    setFile(null);
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const formData = new FormData();
        formData.append('assignment_title', submissionTitle || '');
        formData.append('text', submissionText || '');
        if (file) formData.append('file', file);

        // Dynamically construct the endpoint and method
        const endpoint = submission
          ? `/api/courses/submission/${submission.id}/`
          : '/api/courses/submission/';
        const method = submission ? 'patch' : 'post';

        const response = await api[method](endpoint, formData);

        setOpenSnackbar(true);
        setError(null);
        handleDialogClose();
        setLoading(true);

        // Fetch updated submission data
        const updatedResponse = await api.get(`/api/courses/student_insight/`);
        const updatedSubmission = updatedResponse.data.assignment_submission.find(
          s => s.assignment === parseInt(assignmentId)
        );
        setSubmission(updatedSubmission || null);
        setLoading(false);
      } catch (err) {
        setError('Failed to submit assignment.');
        setOpenSnackbar(true);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  return (
    <Box sx={{ backgroundColor: '#f5f6fa', minHeight: '100vh', paddingY: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 3, boxShadow: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert severity="error">{error}</Alert>
            </Snackbar>
          ) : assignment ? (
            <>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#0d47a1', width: 60, height: 60, marginRight: 2 }}>
                    <AssignmentIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      {assignment.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                      <Chip label="✔ Done: View" color="success" variant="outlined" />
                      <Chip label="📌 To do: Receive a grade" color="info" variant="outlined" />
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginY: 3 }} />

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
                  <Typography variant="h6">Assignment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ lineHeight: 2 }}>
                    <Typography><strong>Description:</strong> {assignment.description}</Typography>
                    <Typography><strong>Marks:</strong> {assignment.marks}</Typography>
                    <Typography><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleString()}</Typography>
                    <Typography><strong>Allowed File Types:</strong> {assignment.allowed_file_types || 'N/A'}</Typography>
                    <Typography><strong>Max File Size:</strong> {(assignment.max_file_size / 1024 / 1024).toFixed(2)} MB</Typography>
                    <Typography><strong>Attempts Allowed:</strong> {assignment.attempts}</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {submission && (
                <Box mt={3} p={2} bgcolor="#e8f5e9" borderRadius={2}>
                  <Typography variant="h6">Previous Submission</Typography>
                  <Typography><strong>Title:</strong> {submission.assignment_title}</Typography>
                  <Typography><strong>Submitted On:</strong> {new Date(submission.submission_date).toLocaleString()}</Typography>
                  <Typography><strong>Attempts Used:</strong> {submission.obtained_attempts}</Typography>
                  <Typography><strong>Marks Obtained:</strong> {submission.obtained_marks ?? 'Pending'}</Typography>
                  <Typography><strong>Feedback:</strong> {submission.feedback ?? 'Not yet provided'}</Typography>
                  {submission.file && (
                    <Typography>
                      <strong>File:</strong> <a href={submission.file} target="_blank" rel="noreferrer">Download</a>
                    </Typography>
                  )}
                </Box>
              )}

              <Box textAlign="center" mt={4}>
                <Button variant="contained" size="large" onClick={handleSubmitClick}>
                  {submission ? 'Update Submission' : 'Upload Submission'}
                </Button>
              </Box>

              <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>{submission ? 'Update Assignment Submission' : 'Upload Assignment Submission'}</DialogTitle>
                <DialogContent dividers>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {activeStep === 0 && (
                    <Box mt={3}>
                      <TextField
                        fullWidth
                        label="Submission Title"
                        variant="outlined"
                        value={submissionTitle}
                        onChange={(e) => setSubmissionTitle(e.target.value)}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        label="Submission Text"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        margin="normal"
                      />
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Or Upload File:
                      </Typography>
                      <TextField
                        type="file"
                        fullWidth
                        onChange={handleFileChange}
                        margin="normal"
                        inputProps={{ accept: assignment.allowed_file_types || '*' }}
                      />
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box mt={3}>
                      <Typography variant="h6">Review Submission</Typography>
                      <Typography><strong>Title:</strong> {submissionTitle || 'N/A'}</Typography>
                      <Typography><strong>Text:</strong> {submissionText || 'N/A'}</Typography>
                      {file && (
                        <Typography sx={{ mt: 1 }}>
                          <strong>File:</strong> {file.name}
                        </Typography>
                      )}
                    </Box>
                  )}
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleDialogClose}>Cancel</Button>
                  {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
                  <Button variant="contained" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? (submission ? 'Update' : 'Submit') : 'Next'}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Typography align="center">No assignment found.</Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default StudentAssignmentDetailPage;
