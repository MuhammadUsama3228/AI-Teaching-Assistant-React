import React, { useState, useEffect } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Avatar,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Skeleton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, MoreVert, Gavel, CalendarToday, InfoOutlined, Delete } from '@mui/icons-material';
import api from '../../../api';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import UpdateAssignmentForm from './update_assignment';
import UpdateSolutionForm from './solution.jsx';

import CreatePenaltyForm from './simple_panality';
import CreateVariationPenaltyForm from './variation_panality';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(6),
  backgroundColor: '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(4),
}));

const AssignmentAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  color: theme.palette.common.white,
  fontSize: '4rem',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  userSelect: 'none',
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  backgroundColor: statuscolor,
  color: theme.palette.getContrastText(statuscolor),
  fontWeight: '600',
  textTransform: 'uppercase',
}));

const getStatusColor = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  if (due < now) return '#d32f2f'; // red for overdue
  return '#388e3c'; // green for upcoming or due
};

const AssignmentDetailPage = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [penaltyAnchorEl, setPenaltyAnchorEl] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPenaltyDialog, setOpenPenaltyDialog] = useState(false);
  const [penaltyType, setPenaltyType] = useState('');
  const [deletingFileId, setDeletingFileId] = useState(null);

  const [openSolutionDialog, setOpenSolutionDialog] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutions, setSolutions] = useState([]);







  const navigate = useNavigate();

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/api/courses/assignment/${assignmentId}/`);
      setAssignment(response.data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await api.get(`/api/courses/solution/?assignment=${assignmentId}`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAssignment(), fetchSolutions()]);
      } catch (error) {
        console.error('Error fetching assignment or solutions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);






  const handleSolutionEdit = (solution) => {
    setSelectedSolution(solution);
    setOpenSolutionDialog(true);
  };

  const handleSolutionUpdate = async () => {
    await fetchSolutions();
    setOpenSolutionDialog(false);
  };

  // Menu Handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handlePenaltyMenuOpen = (event) => setPenaltyAnchorEl(event.currentTarget);
  const handlePenaltyMenuClose = () => setPenaltyAnchorEl(null);

  // Action handlers
  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/courses/assignment/${assignmentId}/`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting assignment:', error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleUpdateClick = () => {
    handleMenuClose();
    setOpenUpdateDialog(true);
  };

  const handleSubmissionStatusClick = () => {
    handleMenuClose();
    navigate(`/courses/assignment/${assignmentId}/submissions`);
  };

  const handlePenaltyClick = (type) => {
    setPenaltyType(type);
    setPenaltyAnchorEl(null);
    setOpenPenaltyDialog(true);
  };

  // New: Delete single file handler
 const handleDeleteFile = async (fileId) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return;

  setDeletingFileId(fileId);
  try {
    await api.delete(`/api/courses/assignment_content/${fileId}/`);
    await fetchAssignment(); // refresh list after deletion
  } catch (error) {
    console.error('Error deleting file:', error);
  } finally {
    setDeletingFileId(null);
  }
};


  if (loading) {
    return (
      <StyledContainer maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Skeleton variant="circular" width={128} height={128} />
          <Skeleton variant="text" width="60%" height={50} sx={{ marginY: 2 }} />
          <Skeleton variant="text" width="40%" height={35} />
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Box>
          <Skeleton variant="rectangular" height={120} sx={{ marginBottom: 3 }} />
          <Skeleton variant="rectangular" height={120} />
        </Box>
      </StyledContainer>
    );
  }

  if (!assignment) {
    return (
      <Typography variant="h6" color="textSecondary" textAlign="center" mt={8}>
        Assignment not found.
      </Typography>
    );
  }

  const dueDateObj = new Date(assignment.due_date);
  const statusColor = getStatusColor(assignment.due_date);

  return (
    <StyledContainer maxWidth="md">
      {/* Header with avatar, title, marks and status */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4} md={3} textAlign={{ xs: 'center', sm: 'left' }}>
          <AssignmentAvatar>{assignment.title.charAt(0).toUpperCase()}</AssignmentAvatar>
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="h3" sx={{ fontWeight: '700', mb: 0.5 }}>
            {assignment.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle1" color="textSecondary">
              Marks: <strong>{assignment.marks}</strong>
            </Typography>
            <Chip
              label={`Due: ${dueDateObj.toLocaleDateString()} ${dueDateObj.toLocaleTimeString()}`}
              icon={<CalendarToday />}
              variant="outlined"
              size="medium"
            />
            <StatusChip label={dueDateObj < new Date() ? 'Overdue' : 'Due'} statuscolor={statusColor} />
          </Stack>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <InfoOutlined fontSize="small" />
            Created at: {new Date(assignment.created_at).toLocaleString()}
          </Typography>
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12} textAlign="right">
          <Tooltip title="Assignment options">
            <IconButton onClick={handleMenuOpen} size="large">
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Tooltip title="Apply penalty">
            <IconButton onClick={handlePenaltyMenuOpen} sx={{ ml: 1 }} size="large">
              <Gavel />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Assignment Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              <strong>Description:</strong> {assignment.description || 'No description available.'}
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                <strong>Allowed File Types:</strong>{' '}
                {assignment.allowed_file_types ? assignment.allowed_file_types : 'Allow all file types'}
              </Typography>

              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Attempts:</strong> {assignment.attempts}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Max File Size:</strong> {(assignment.max_file_size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Last Updated:</strong> {new Date(assignment.updated_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

   
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Assignment Contents ({assignment.assignment_files?.length || 0})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {assignment.assignment_files?.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {assignment.assignment_files.map((file) => {
                const fileName = file.file.split('/').pop();
                const isImage = /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName || '');

                return (
                  <Box
                    key={file.id}
                    sx={{
                      width: 200,
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: '#fff',
                      position: 'relative',
                      textAlign: 'center',
                    }}
                  >
                    {/* Delete icon */}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={deletingFileId === file.id}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>

                    {/* File Icon */}
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#1a73e8',
                          width: 48,
                          height: 48,
                          margin: '0 auto',
                        }}
                      >
                        {isImage ? <ImageIcon fontSize="medium" /> : <InsertDriveFileIcon fontSize="medium" />}
                      </Avatar>
                    </Box>

                    {/* File name */}
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ mb: 1, maxWidth: '100%', fontWeight: 500 }}
                      title={fileName}
                    >
                      {fileName}
                    </Typography>

                    {/* View button */}
                    <Button
                      href={file.file_url || file.file}
                      target="_blank"
                      rel="noopener"
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      VIEW
                    </Button>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No files uploaded for this assignment.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>


      {solutions.map((sol) => (
          <Accordion key={sol.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Assignment Solution
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                <strong>Text:</strong> {sol.text || 'No text provided.'}
              </Typography>

              {sol.files?.length > 0 ? (
                  <Box>
                    <Typography sx={{ mb: 1 }}>
                      <strong>Files:</strong>
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {sol.files.map((fileObj) => {
                        const fileUrl = fileObj.file;
                        const fileName = fileUrl?.split('/').pop() || 'File';
                        const isImage = /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName);

                        return (
                            <Box
                                key={fileObj.id}
                                sx={{
                                  width: 200,
                                  p: 2,
                                  borderRadius: 2,
                                  boxShadow: 3,
                                  backgroundColor: '#fff',
                                  textAlign: 'center',
                                }}
                            >
                              <Box sx={{ mt: 1, mb: 2 }}>
                                <Avatar
                                    sx={{
                                      bgcolor: '#1a73e8',
                                      width: 48,
                                      height: 48,
                                      margin: '0 auto',
                                    }}
                                >
                                  {isImage ? (
                                      <ImageIcon fontSize="medium" />
                                  ) : (
                                      <InsertDriveFileIcon fontSize="medium" />
                                  )}
                                </Avatar>
                              </Box>

                              <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{ mb: 1, maxWidth: '100%', fontWeight: 500 }}
                                  title={fileName}
                              >
                                {fileName}
                              </Typography>

                              <Button
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                              >
                                VIEW
                              </Button>
                            </Box>
                        );
                      })}
                    </Box>
                  </Box>
              ) : (
                  <Typography variant="body2" color="textSecondary">
                    No files uploaded.
                  </Typography>
              )}

              <Box mt={2} textAlign="right">
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleSolutionEdit(sol)}
                >
                  Edit
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
      ))}




      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleUpdateClick}>Update Assignment</MenuItem>
        <MenuItem onClick={handleSubmissionStatusClick}>View Submission Status</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete Assignment</MenuItem>
      </Menu>

      {/* Update Assignment Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Update Assignment</DialogTitle>
        <DialogContent dividers>
          <UpdateAssignmentForm assignment={assignment} onClose={() => setOpenUpdateDialog(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this assignment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Penalty Dialog (existing) */}
      <Dialog open={openPenaltyDialog} onClose={() => setOpenPenaltyDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Apply Penalty</DialogTitle>
        <DialogContent dividers>
          {penaltyType === 'simple' && <CreatePenaltyForm assignmentId={assignmentId} onClose={() => setOpenPenaltyDialog(false)} />}
          {penaltyType === 'variation' && <CreateVariationPenaltyForm assignmentId={assignmentId} onClose={() => setOpenPenaltyDialog(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog
          open={openSolutionDialog}
          onClose={() => setOpenSolutionDialog(false)}
          fullWidth
          maxWidth="sm"
          keepMounted={false} // ✅ This prevents MUI from hiding content with aria-hidden while it's still focused
      >
        <DialogTitle>Update Solution</DialogTitle>
        <DialogContent dividers>
          <UpdateSolutionForm
              solution={selectedSolution}
              onClose={handleSolutionUpdate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSolutionDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* Penalty menu */}
      <Menu
        anchorEl={penaltyAnchorEl}
        open={Boolean(penaltyAnchorEl)}
        onClose={handlePenaltyMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handlePenaltyClick('simple')}>Simple Penalty</MenuItem>
        <MenuItem onClick={() => handlePenaltyClick('variation')}>Variation Penalty</MenuItem>
      </Menu>
    </StyledContainer>
  );
};

export default AssignmentDetailPage;
