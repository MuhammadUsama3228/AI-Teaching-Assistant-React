// src/pages/StudentAssignmentDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Accordion, AccordionSummary,
  AccordionDetails, Divider, Button, Snackbar, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle, Paper, Skeleton, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import api from '../../../api.js';
import Student_feedback from './student_feedback.jsx';
import StudentAssignmentSubmission from './student_submission.jsx';
import StudentAssignmentSubmissionPerform from './student_submission_perform.jsx';
import StudentAssignmentSolutions from './student_solution.jsx';
import StudentAssignmentContent from './student_assignmet_content.jsx';
import VariationPenalty from "./variation_panality.jsx";
import VariationPenaltyAccordion from './variation_panality.jsx'
import ViewPlagiarismReport from "./assignement_plagirism.jsx";

import RecheckButton from "./recheck_submission.jsx";
import AssignmentPenaltyAccordion from "./assignment_panality.jsx";
import PenaltyAccordionWrapper from '../Student Assignment/wrapper/panality_wrapper.jsx'
import ScannedDocumentDetails from "./assignement_plagirism.jsx";
const PRIMARY_COLOR = '#4B2E83'; // UMT Purple


const StudentAssignmentDetailPage = () => {
  const { assignmentId } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const insightRes = await api.get("/api/courses/student_insight/");
        const foundAssignment = insightRes.data.assignment.find(
            a => String(a.id) === String(assignmentId)
        );

        if (!foundAssignment) {
          setError("Assignment not found.");
          setOpenSnackbar(true);
          return;
        }

        setAssignment(foundAssignment);

        const submissionRes = await api.get(`/api/courses/submission/?assignment=${assignmentId}`);
        const existingSubmission = submissionRes.data.length > 0 ? submissionRes.data[0] : null;
        setSubmission(existingSubmission);

        if (existingSubmission) {
          const submissionFilesRes = await api.get(`/api/courses/assignment_submission_content/?submission_id=${existingSubmission.id}`);
          setSubmissionFiles(submissionFilesRes.data);
        } else {
          setSubmissionFiles([]);
        }

      } catch {
        setError("Failed to load assignment or submission.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) fetchData();
  }, [assignmentId]);

  const isDeadlinePassed = () => {
    if (!assignment?.due_date) return false;
    return new Date() > new Date(assignment.due_date);
  };

  const getStatusAlert = () => {
    if (!submission) return null;
    if (submission.obtained_marks !== null && submission.feedback) {
      return <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 2 }}>Feedback provided and assignment marked.</Alert>;
    }
    if (submission.feedback) {
      return <Alert icon={<HourglassEmptyIcon />} severity="info" sx={{ mb: 2 }}>Feedback given but marks are pending.</Alert>;
    }
    return <Alert icon={<WarningIcon />} severity="warning" sx={{ mb: 2 }}>Awaiting evaluation and feedback.</Alert>;
  };

  return (
      <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', py: 5 }}>
        <Container maxWidth="md">
          <Paper elevation={6} sx={{ borderRadius: 3, p: isSmallScreen ? 2 : 4, backgroundColor: '#fff' }}>
            <Box display="flex" alignItems="center" mb={3} flexDirection={isSmallScreen ? 'column' : 'row'}>
              <Avatar sx={{ bgcolor: PRIMARY_COLOR, width: 60, height: 60, mr: isSmallScreen ? 0 : 2, mb: isSmallScreen ? 1 : 0 }}>
                <AssignmentIcon fontSize="large" />
              </Avatar>
              <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant="h5" fontWeight="bold" color={PRIMARY_COLOR}>
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

                  <Accordion defaultExpanded sx={{ mb: 4 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />} sx={{ backgroundColor: "#f3eafc" }}>
                      <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
                        Assignment Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: "#f9fafb" }}>
                      <Typography gutterBottom><strong>Title:</strong> {assignment.title}</Typography>
                      <Typography gutterBottom><strong>Description:</strong> {assignment.description}</Typography>
                      <Typography gutterBottom><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleString()}</Typography>
                      <Typography gutterBottom><strong>Marks:</strong> {assignment.marks}</Typography>
                      <Typography gutterBottom><strong>Attempts Allowed:</strong> {assignment.attempts}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  <PenaltyAccordionWrapper assignmentId={assignmentId} />
                  <ScannedDocumentDetails submission_id={submission.id} submission_file_id={submissionFiles.id}/>

                  <StudentAssignmentContent assignmentId={assignmentId} />
                  <StudentAssignmentSubmission assignmentId={assignmentId} />


                  {isDeadlinePassed() && (
                      <>
                        <StudentAssignmentSolutions assignmentId={assignmentId} />
                        <Student_feedback submissionId={submission.id} />
                        <ViewPlagiarismReport submissionId={submission.id} />
                        <Box display="flex" justifyContent="center" mt={2}>
                          <RecheckButton assignmentId={submission.assignment} />
                        </Box>




                      </>
                  )}

                  {(
                      submission?.obtained_attempts === null ||
                      (submission?.obtained_attempts > 0 && new Date() < new Date(assignment?.due_date))
                  ) && (
                      <Box mt={4} textAlign="center">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                              bgcolor: PRIMARY_COLOR,
                              '&:hover': { bgcolor: '#3b256a' }
                            }}
                            onClick={() => setOpenDialog(true)}
                        >
                          {submission ? "Update Submission" : "Upload Submission"}
                        </Button>
                      </Box>
                  )}

                  <Dialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      fullWidth
                      maxWidth="md"
                  >
                    <DialogTitle sx={{ fontWeight: 'bold', bgcolor: '#f3eafc', color: PRIMARY_COLOR }}>
                      {submission ? "Update Submission Details" : "Upload New Submission"}
                    </DialogTitle>

                    <DialogContent dividers sx={{ bgcolor: '#fafafa' }}>
                      {submission ? (
                          <StudentAssignmentSubmissionPerform
                              assignmentId={assignmentId}
                              submissionId={submission.id}
                          />
                      ) : (
                          <Alert severity="info">
                            No submission found. Please upload your assignment first.
                          </Alert>
                      )}
                    </DialogContent>

                    <DialogActions sx={{ bgcolor: '#f5f5f5' }}>
                      <Button onClick={() => setOpenDialog(false)} sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }} variant="outlined">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>



                </>
            )}

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
              <Alert onClose={() => setOpenSnackbar(false)} severity={error ? "error" : "success"}>
                {error || "Operation successful."}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      </Box>
  );
};

export default StudentAssignmentDetailPage;
