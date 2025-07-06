import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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
  useMediaQuery,
  Tabs,
  Card,
  IconButton,
  Tab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import api from '../../api';

const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [solution, setSolution] = useState(null);

  const [file, setFile] = useState(null);

  const steps = ['Enter Submission', 'Review & Submit'];

  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      try {
        setLoading(true);

        // Fetch all assignments and courses insight
        const insightRes = await api.get("/api/courses/student_insight/");
        const foundAssignment = insightRes.data.assignment.find(a => String(a.id) === String(assignmentId));
        const foundAssignmentSolution = insightRes.data.assignment_solution.find(a => String(a.id) === String(assignmentId));


        if (!foundAssignment) {
          setError('Assignment not found.');
          setOpenSnackbar(true);
          setLoading(false);
          return;
        }
        setAssignment(foundAssignment);

       

        setSolution(foundAssignmentSolution);

        // Fetch submission for this assignment
        const submissionRes = await api.get(`/api/courses/submission/?assignment=${assignmentId}`);
        const foundSubmission = submissionRes.data.length > 0 ? submissionRes.data[0] : null;
        setSubmission(foundSubmission);
        setSubmissionTitle(foundSubmission?.assignment_title || '');
      } catch (err) {
        setError('Failed to load assignment or submission data');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) fetchAssignmentAndSubmission();
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

        // Refresh submission after update
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
          {/* Header */}
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
              {/* Assignment Details */}

    <Accordion defaultExpanded sx={{ mb: 4 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ backgroundColor: "#e9f1fb" }}
      >
        <Typography variant="h6">Assignment Details</Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 2, backgroundColor: "#f9fafb" }}>
        <Typography gutterBottom>
          <strong>Title:</strong> {assignment.title}
        </Typography>
        <Typography gutterBottom>
          <strong>Description:</strong> {assignment.description}
        </Typography>
        <Typography gutterBottom>
          <strong>Due Date:</strong>{" "}
          {new Date(assignment.due_date).toLocaleString()}
        </Typography>
        <Typography gutterBottom>
          <strong>Marks:</strong> {assignment.marks}
        </Typography>
        <Typography gutterBottom>
          <strong>Attempts Allowed:</strong> {assignment.attempts}
        </Typography>

       
      </AccordionDetails>
    </Accordion >

     {assignment.assignment_files?.length > 0 && (
    <Accordion defaultExpanded sx={{ mb: 4 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#e9f1fb" }}
            >
              <Typography variant="h6">Assignment Files</Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {assignment.assignment_files.map((file) => (
                <Card
                  key={file.id}
                  sx={{
                    width: 200,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <InsertDriveFileIcon
                    sx={{ fontSize: 40, color: "#1976d2", mb: 1 }}
                  />
                  <Typography variant="body2" noWrap>
                    
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Button>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
              

             
            

              {/* Submission Accordion */}
              {submission ? (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e9f1fb' }}>
                    <Typography variant="h6">Submission Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography gutterBottom><strong>Submission Title:</strong> {submission.assignment_title}</Typography>
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

              {/* Submit/Update Button */}
            {submission.obtained_attempts > 0 && (
              <Box mt={4} textAlign="center">
                <Button variant="contained" onClick={handleSubmitClick} size="large" sx={{ bgcolor: '#003366' }}>
                  {submission ? 'Update Submission' : 'Upload Submission'}
                </Button>
              </Box>
              
            )}

            </>
          )}

{solution && submission?.obtained_attempts === 0 && (
  <Accordion defaultExpanded sx={{ mt: 4 }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e9f1fb' }}>
      <Typography variant="h6">Solution</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ backgroundColor: '#f9fafb' }}>
      {solution.text && (
        <Typography gutterBottom>
          <strong>Text:</strong> {solution.text}
        </Typography>
      )}
      {solution.file && (
        <Typography>
          <strong>File:</strong>{' '}
          <a href={solution.file} target="_blank" rel="noopener noreferrer">
            View Solution
          </a>
        </Typography>
      )}
      {!solution.text && !solution.file && (
        <Typography>No solution provided yet.</Typography>
      )}
    </AccordionDetails>
  </Accordion>
)}




          {/* Submission Dialog */}
         <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#003366', fontSize: '1.5rem' }}>
        Submit Assignment
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={activeStep}
          onChange={(e, newVal) => setActiveStep(newVal)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          {steps.map((label) => (
            <Tab key={label} label={label} sx={{ fontWeight: 'bold', fontSize: '0.95rem' }} />
          ))}
        </Tabs>

        {activeStep === 0 && (
          <>
            <TextField
              label="Submission Title"
              fullWidth
              value={submissionTitle}
              onChange={(e) => setSubmissionTitle(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Enter your assignment title"
            />

            <Box
              onClick={() => document.getElementById('file-upload-input').click()}
              sx={{
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                color: 'text.secondary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s, box-shadow 0.3s',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.25)',
                  color: 'primary.main',
                  borderColor: 'primary.dark',
                  '& svg': {
                    transform: 'scale(1.1)',
                  },
                },
                userSelect: 'none',
                minHeight: 140,
              }}
            >
              <UploadFileIcon color="primary" sx={{ fontSize: 56, transition: 'transform 0.3s' }} />
              <Typography variant="body1" color="text.secondary" mt={1}>
                Drag and drop a file here, or click to browse
              </Typography>
              <input
                id="file-upload-input"
                type="file"
                hidden
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>

            {file && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: '#e3f2fd',
                  color: 'primary.dark',
                  fontWeight: 600,
                  wordBreak: 'break-word',
                  textAlign: 'center',
                }}
              >
                Selected file: {file.name}
              </Typography>
            )}
          </>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography sx={{ mb: 1 }}>
              <strong>Title:</strong> {submissionTitle || submission?.assignment_title}
            </Typography>
            <Typography>
              <strong>File:</strong>{' '}
              {file ? file.name : submission?.file ? 'Existing file uploaded' : 'No file uploaded'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleDialogClose} color="secondary" variant="outlined" size="medium">
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="primary" variant="outlined" size="medium">
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          size="medium"
          sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
        >
          {activeStep === steps.length - 1 ? (submission ? 'Update' : 'Submit') : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={error ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {error || 'Operation successful.'}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentAssignmentDetailPage;
