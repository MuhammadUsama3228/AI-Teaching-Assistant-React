import React, { useState, useEffect } from 'react';
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
import UpdateAssignmentForm from './update_assignment';
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
  const navigate = useNavigate();

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/courses/assignment/${assignmentId}/`);
      setAssignment(response.data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

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
      // Adjust API path as per your backend endpoint for deleting a file
      await api.delete(`/api/courses/assignment/${fileId}/`);
      // Refresh assignment data to update file list
      await fetchAssignment();
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

      {/* Assignment details accordion */}
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
                  <strong>Allowed File Types:</strong> {assignment.allowed_file_types}
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

      {/* New Accordion: Files */}
   <Accordion>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      Files ({assignment.assignment_files ? assignment.assignment_files.length : 0})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {assignment.assignment_files && assignment.assignment_files.length > 0 ? (
      <Stack spacing={2}>
        {assignment.assignment_files.map((file) => (
          <Box
            key={file.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#f1f1f1',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                📄
              </Avatar>
              <Link
                href={file.file}
                target="_blank"
                rel="noopener"
                underline="hover"
                variant="body1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  display: 'inline-block',
                }}
              >
                {file.file.split('/').pop()}
              </Link>
            </Box>
            <Tooltip title="Delete File">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteFile(file.id)}
                  disabled={deletingFileId === file.id}
                >
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="textSecondary">
        No files uploaded for this assignment.
      </Typography>
    )}
  </AccordionDetails>
</Accordion>


      {/* Main menu for update, view submissions, delete */}
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
