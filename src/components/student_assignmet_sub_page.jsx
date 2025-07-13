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
import api from '../api.js';

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [files, setFiles] = useState([]);

  const steps = ['Enter Submission', 'Review & Submit'];

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/courses/student_insight/`);
        const assignments = response.data.assignment || [];
        const submissions = response.data.assignment_submission || [];
        const assignmentSolutions = response.data.assignment_solution || [];
        const assignmentFeedbacks = response.data.feedback || [];

        const assignmentIdInt = parseInt(assignmentId, 10);
        const foundAssignment = assignments.find((a) => parseInt(a.id, 10) === assignmentIdInt);
        if (!foundAssignment) throw new Error("Assignment not found");

        setAssignment(foundAssignment);
        const foundSubmission = submissions.find((s) => parseInt(s.assignment, 10) === assignmentIdInt);
        setSubmission(foundSubmission || null);

        // Filter solutions for this assignment
        const relatedSolutions = assignmentSolutions.filter(
            (sol) => parseInt(sol.assignment, 10) === assignmentIdInt
        );
        setSolutions(relatedSolutions);

        // Filter feedbacks for submission of this assignment
        const relatedSubmissionIds = submissions
            .filter((s) => parseInt(s.assignment, 10) === assignmentIdInt)
            .map((s) => s.id);
        const relatedFeedbacks = assignmentFeedbacks.filter((fb) =>
            relatedSubmissionIds.includes(fb.submission_id)
        );
        setFeedbacks(relatedFeedbacks);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignment");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);


  const handleSnackbarClose = () => setOpenSnackbar(false);
  const handleSubmitClick = () => {
    setSubmissionTitle(submission?.assignment_title || '');
    setSubmissionText(submission?.text || '');
    setFiles([]);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setActiveStep(0);
    setSubmissionTitle('');
    setSubmissionText('');
    setFiles([]);
  };

  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const formData = new FormData();
        formData.append('assignment_title', submissionTitle);
        formData.append('text', submissionText);

        const endpoint = submission ? `/api/courses/submission/${submission.id}/` : '/api/courses/submission/';
        const method = submission ? 'patch' : 'post';
        const response = await api[method](endpoint, formData);
        const submissionId = submission ? submission.id : response.data.id;

        for (const file of files) {
          const fileData = new FormData();
          fileData.append('submission', submissionId);
          fileData.append('file', file);
          await api.post('/api/courses/assignment_submission_content/', fileData);
        }

        setOpenSnackbar(true);
        setError(null);
        handleDialogClose();
        setLoading(true);

        const updatedResponse = await api.get(`/api/courses/student_insight/`);
        const updatedSubmission = updatedResponse.data.assignment_submission.find(
            (s) => parseInt(s.assignment, 10) === parseInt(assignmentId, 10)
        );
        setSubmission(updatedSubmission || null);
      } catch (err) {
        console.error(err);
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

  const deadlinePassed = assignment ? new Date(assignment.due_date) < new Date() : false;
  const noAttemptsLeft = submission && (assignment.attempts - submission.obtained_attempts) <= 0;
  const canSubmit = !deadlinePassed && !noAttemptsLeft;

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

                        {submission.files && submission.files.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="subtitle1">Submitted Files:</Typography>
                              <Stack spacing={1}>
                                {submission.files.map((fileObj) => {
                                  const fileName = decodeURIComponent(fileObj.file.split('/').pop());
                                  return (
                                      <Box key={fileObj.id} display="flex" alignItems="center" justifyContent="space-between">
                                        <a href={fileObj.file} download target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                          {fileName}
                                        </a>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={async () => {
                                              try {
                                                await api.delete(`/api/courses/assignment_submission_content/${fileObj.id}/`);
                                                setSubmission((prev) => ({
                                                  ...prev,
                                                  files: prev.files.filter((f) => f.id !== fileObj.id),
                                                }));
                                                setOpenSnackbar(true);
                                                setError(null);
                                              } catch (err) {
                                                setError('Failed to delete file.');
                                                setOpenSnackbar(true);
                                              }
                                            }}
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                  );
                                })}
                              </Stack>
                            </Box>
                        )}
                      </Box>
                  )}

                  <Box textAlign="center" mt={4}>
                    {canSubmit ? (
                        <Button variant="contained" size="large" onClick={handleSubmitClick}>
                          {submission ? 'Update Submission' : 'Upload Submission'}
                        </Button>
                    ) : (
                        <Typography color="error" variant="h6">Submission Closed</Typography>
                    )}
                  </Box>


                      <Box mt={4}>
                        {/* Solutions Accordion */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#fff3e0' }}>
                            <Typography variant="h6">Assignment Solutions</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {solutions && solutions.length > 0 ? (
                                solutions.map((sol) => (
                                    <Box key={sol.id} mt={2}>
                                      <Typography><strong>Solution Created At:</strong> {new Date(sol.created_at).toLocaleString()}</Typography>
                                      {sol.text && <Typography><strong>Text:</strong> {sol.text}</Typography>}
                                      {sol.files && sol.files.length > 0 && (
                                          <Box mt={1}>
                                            <Typography><strong>Solution Files:</strong></Typography>
                                            {sol.files.map((f, idx) => (
                                                <a key={idx} href={f.file} target="_blank" rel="noreferrer" style={{ display: 'block', color: '#1976d2' }}>
                                                  {f.file.split('/').pop()}
                                                </a>
                                            ))}
                                          </Box>
                                      )}
                                    </Box>
                                ))
                            ) : (
                                <Typography>No solution uploaded yet.</Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/* Feedback Accordion */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e8f5e9' }}>
                            <Typography variant="h6">Assignment Feedback</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {feedbacks && feedbacks.length > 0 ? (
                                feedbacks.map((fb) => (
                                    <Box key={fb.id} mt={2}>
                                      <Typography><strong>Feedback:</strong> {fb.feedback_text}</Typography>
                                      <Typography><strong>Rating:</strong> {fb.rating}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No feedback available yet.</Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Box>



                  {/* Submission Dialog */}
                  <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
                    <DialogTitle>{submission ? 'Update Assignment Submission' : 'Upload Assignment Submission'}</DialogTitle>
                    <DialogContent dividers>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
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
                            <Typography variant="subtitle1" sx={{ mt: 2 }}>Upload Files:</Typography>
                            <TextField
                                type="file"
                                fullWidth
                                inputProps={{ multiple: true, accept: assignment.allowed_file_types || '*' }}
                                onChange={handleFileChange}
                                margin="normal"
                            />
                            {files.length > 0 && (
                                <Box mt={2}>
                                  <Typography variant="subtitle1">Files to Upload:</Typography>
                                  <Stack spacing={1}>
                                    {files.map((file, idx) => (
                                        <Box key={idx} display="flex" alignItems="center" justifyContent="space-between">
                                          <Typography>{file.name}</Typography>
                                          <Button size="small" color="error" onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}>
                                            Remove
                                          </Button>
                                        </Box>
                                    ))}
                                  </Stack>
                                </Box>
                            )}
                          </Box>
                      )}
                      {activeStep === 1 && (
                          <Box mt={3}>
                            <Typography variant="h6">Review Submission</Typography>
                            <Typography><strong>Title:</strong> {submissionTitle || 'N/A'}</Typography>
                            <Typography><strong>Text:</strong> {submissionText || 'N/A'}</Typography>
                            {files.length > 0 && (
                                <Typography sx={{ mt: 1 }}>
                                  <strong>Files:</strong> {files.map((file) => file.name).join(', ')}
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
