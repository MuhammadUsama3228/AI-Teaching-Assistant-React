import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip,
    DialogActions,
    Button,
    Box,
} from "@mui/material";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred"; // 🔴 Attractive red warning
import PlagiarismForm from "../assignment/plagirisim_panality.jsx";

const PlagiarismDialogWrapper = ({ assignmentId, statusColor }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            {/* Left-side Red Warning Icon */}
            <ReportGmailerrorredIcon color="error" fontSize="medium" />

            {/* Tooltip + IconButton to open dialog */}
            <Tooltip title="Apply Plagiarism Penalty">
                <IconButton onClick={handleOpen} color="error" size="small">
                    <ReportGmailerrorredIcon />
                </IconButton>
            </Tooltip>

            {/* Dialog with form */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Apply Plagiarism Penalty</DialogTitle>
                <DialogContent dividers>
                    <PlagiarismForm assignmentId={assignmentId} statusColor={statusColor} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PlagiarismDialogWrapper;
